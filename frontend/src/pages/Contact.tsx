import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

function Contact() {
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // Simulate API call (EmailJS or Supabase insert)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log("Message sent:", data);
    setIsSubmitting(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
    reset();
  };

  return (
    <div className="min-h-screen bg-background font-sans pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-4">
            <span className="text-primary">Support</span> & Contact
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Need help configuring your goals, understanding your Readiness Score, or linking an integration? Our support team is here to help you maximize your Vitality.io experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border-border shadow-sm">
            <CardHeader className="bg-muted/50 rounded-t-lg">
              <CardTitle className="text-2xl text-primary">
                Submit a Support Ticket
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 mt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      {...register("name")}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    {...register("subject")}
                    className={errors.subject ? "border-red-500" : ""}
                  />
                  {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    {...register("message")}
                    className={`min-h-[120px] ${errors.message ? "border-red-500" : ""}`}
                  />
                  {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
                </div>
                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/50 rounded-t-lg">
                <CardTitle className="text-2xl text-primary">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6 mt-2">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email Support</h3>
                    <p className="text-muted-foreground">support@vitality.io</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Call Us</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Visit Us</h3>
                    <p className="text-muted-foreground">
                      123 Health Street<br />Wellness City, WC 12345
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/50 rounded-t-lg">
                <CardTitle className="text-2xl text-primary">Office Hours</CardTitle>
              </CardHeader>
              <CardContent className="p-6 mt-2">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2 w-full text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span className="font-semibold text-foreground">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="font-semibold text-foreground">10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="font-semibold text-foreground">Closed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-foreground py-3 px-6 rounded-lg shadow-lg transition-all animate-in slide-in-from-bottom-5 duration-300">
          <p className="font-medium">Message Sent!</p>
          <p className="text-sm">Thank you for contacting us. We'll get back to you soon.</p>
        </div>
      )}
    </div>
  );
}

export default Contact;
