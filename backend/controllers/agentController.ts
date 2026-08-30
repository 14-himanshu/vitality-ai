import { Request, Response } from 'express';
import { db } from '../config/db';

export const processCommand = async (req: Request, res: Response) => {
  let { command, imageBase64 } = req.body;
  const userId = (req as any).user.id;

  if (!command && !imageBase64) {
    return res.status(400).json({ error: 'Command or Image is required' });
  }

  // Phase 4: PII Scrubbing
  const scrubPII = (text: string) => {
    if (!text) return text;
    return text
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[REDACTED_PHONE]');
  };

  command = scrubPII(command);

  // Phase 7: Fetch historical context
  const fetchUserContext = (): Promise<string> => {
    return new Promise((resolve) => {
      db.all('SELECT * FROM metrics WHERE user_id = ? ORDER BY date DESC LIMIT 5', [userId], (err, metrics) => {
        db.all('SELECT * FROM clinical_data WHERE user_id = ? ORDER BY test_date DESC LIMIT 5', [userId], (err2, clinical) => {
          resolve(JSON.stringify({
            recent_metrics: metrics || [],
            recent_clinical_data: clinical || []
          }));
        });
      });
    });
  };

  try {
    const userContext = await fetchUserContext();

    // 1. Forward the request to the Python Agent Service
    const formData = new URLSearchParams();
    if (command) formData.append('command', command);
    else formData.append('command', 'Analyze this image');
    
    formData.append('userId', userId.toString());
    formData.append('userContext', userContext);
    if (imageBase64) {
      // In production, we'd probably use true multipart FormData with binary blob
      // But URLSearchParams works for moderate base64 strings
      formData.append('imageBase64', imageBase64);
    }

    const agentUrl = process.env.PYTHON_AGENT_URL || 'http://localhost:8000';
    const agentRes = await fetch(`${agentUrl}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    if (!agentRes.ok) {
      throw new Error(`Python Agent responded with status: ${agentRes.status}`);
    }

    const agentData = await agentRes.json();
    const { actionType, data, message } = agentData;

    // 2. Handle DB Side-Effects based on actionType
    if (actionType === 'UPDATE_GOAL' && data) {
      db.get('SELECT * FROM goals WHERE user_id = ?', [userId], (err, currentGoals: any) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        const newGoals = {
          target_weight: data.weight || currentGoals?.target_weight || 75.0,
          daily_calories: data.calories || currentGoals?.daily_calories || 2000,
          daily_protein: data.protein || currentGoals?.daily_protein || 150,
          daily_carbs: data.carbs || currentGoals?.daily_carbs || 200,
          daily_fats: data.fats || currentGoals?.daily_fats || 65,
        };

        db.run(
          `INSERT INTO goals (user_id, target_weight, daily_calories, daily_protein, daily_carbs, daily_fats) 
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(user_id) DO UPDATE SET 
             target_weight = excluded.target_weight,
             daily_calories = excluded.daily_calories,
             daily_protein = excluded.daily_protein,
             daily_carbs = excluded.daily_carbs,
             daily_fats = excluded.daily_fats,
             updated_at = CURRENT_TIMESTAMP`,
          [userId, newGoals.target_weight, newGoals.daily_calories, newGoals.daily_protein, newGoals.daily_carbs, newGoals.daily_fats],
          (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update goals' });
            return res.json({ actionType, message, requiresRefresh: true });
          }
        );
      });
      return;
    }

    if (actionType === 'LOG_METRIC' && data) {
      const today = new Date().toISOString().split('T')[0];
      
      db.get('SELECT * FROM metrics WHERE user_id = ? AND date = ?', [userId, today], (err, currentLog: any) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        const newLog = {
          weight: data.weight || currentLog?.weight || null,
          calories: (currentLog?.calories || 0) + (data.calories || 0),
          protein: (currentLog?.protein || 0) + (data.protein || 0),
          carbs: (currentLog?.carbs || 0) + (data.carbs || 0),
          fats: (currentLog?.fats || 0) + (data.fats || 0),
        };

        db.run(
          `INSERT INTO metrics (user_id, date, weight, calories, protein, carbs, fats) 
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(user_id, date) DO UPDATE SET 
             weight = excluded.weight,
             calories = excluded.calories,
             protein = excluded.protein,
             carbs = excluded.carbs,
             fats = excluded.fats`,
          [userId, today, newLog.weight, newLog.calories, newLog.protein, newLog.carbs, newLog.fats],
          (err) => {
            if (err) return res.status(500).json({ error: 'Failed to log data' });
            return res.json({ actionType, message, requiresRefresh: true });
          }
        );
      });
      return;
    }

    if (actionType === 'DIAGNOSTIC_ANALYSIS' && data) {
      const today = new Date().toISOString().split('T')[0];
      const markerName = data.marker_name || 'General Lab';
      const markerValue = data.marker_value || 'N/A';
      const unit = data.unit || '';
      
      db.run(
        `INSERT INTO clinical_data (user_id, test_date, marker_name, marker_value, unit, notes) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, today, markerName, markerValue, unit, message],
        (err) => {
          if (err) console.error('Failed to log clinical data', err);
        }
      );
      // Fall through to return the message to the user, no early return needed for this action
    }

    // Default for purely conversational or generative actions (CHAT, RESCHEDULE_WORKOUT, etc.)
    return res.json({
      actionType: actionType || 'CHAT',
      message: message || "I processed your request, but I don't have a specific response.",
      data: data || {},
      requiresRefresh: false
    });

  } catch (error: any) {
    console.error('Agent Error:', error);
    return res.status(500).json({ 
      actionType: 'ERROR', 
      message: 'Failed to connect to AI Agent. Make sure the Python service is running.',
      requiresRefresh: false 
    });
  }
};
