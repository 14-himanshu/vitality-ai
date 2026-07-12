import requests
import os

USDA_API_KEY = os.environ.get("USDA_API_KEY", "")
SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"

def search_nutrition(query: str) -> str:
    """
    Searches the USDA FoodData Central database for a given food item and returns
    a formatted string of its nutritional content.
    """
    try:
        params = {
            "api_key": USDA_API_KEY,
            "query": query,
            "pageSize": 1
        }
        response = requests.get(SEARCH_URL, params=params)
        response.raise_for_status()
        data = response.json()
        
        if not data.get("foods") or len(data["foods"]) == 0:
            return f"No nutritional data found in USDA database for '{query}'."
            
        food = data["foods"][0]
        desc = food.get("description", "Unknown food")
        
        macros = {"Calories": 0, "Protein": 0, "Fat": 0, "Carbs": 0}
        
        for nutrient in food.get("foodNutrients", []):
            name = nutrient.get("nutrientName", "").lower()
            amount = nutrient.get("value", 0)
            
            if "energy" in name and "kcal" in nutrient.get("unitName", "").lower():
                macros["Calories"] = amount
            elif "protein" in name:
                macros["Protein"] = amount
            elif "total lipid (fat)" in name or "fat" in name:
                macros["Fat"] = amount
            elif "carbohydrate, by difference" in name or "carbohydrate" in name:
                macros["Carbs"] = amount

        return (
            f"USDA Nutritional Data for '{desc}' (per 100g):\n"
            f"- Calories: {macros['Calories']} kcal\n"
            f"- Protein: {macros['Protein']} g\n"
            f"- Carbs: {macros['Carbs']} g\n"
            f"- Fat: {macros['Fat']} g\n"
            f"[Source: USDA FoodData Central (https://fdc.nal.usda.gov/)]"
        )
    except Exception as e:
        return f"Error fetching USDA data: {e}"
