"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Copy, Lightbulb, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { contactFormSchema } from "@/validation";
import { submitContactForm } from "../actions";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const email = "studystackteam@gmail.com";

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      userType: "student",
      class: "",
      messageType: "error",
      subject: "",
      message: "",
    },
  });

  const userType = form.watch("userType");
  const messageType = form.watch("messageType");

  const copyToClipboard = async () => {
    try {
      // Solution 1: Modern clipboard API with permission handling
      if (navigator.clipboard && navigator.clipboard.writeText) {
        // Request permission if needed (for mobile browsers)
        if (navigator.permissions) {
          const { state } = await navigator.permissions.query({
            name: "clipboard-write" as PermissionName,
          });
          if (state !== "granted") {
            throw new Error("Clipboard permission not granted");
          }
        }

        await navigator.clipboard.writeText(email);
        showSuccess();
        return;
      }

      // Solution 2: Legacy document.execCommand fallback
      if (document.execCommand) {
        const textArea = document.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed"; // Prevent scrolling
        document.body.appendChild(textArea);
        textArea.select();

        try {
          const successful = document.execCommand("copy");
          if (!successful) throw new Error("Copy failed");
          showSuccess();
        } finally {
          document.body.removeChild(textArea);
        }
        return;
      }

      // Solution 3: iOS-specific workaround
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const range = document.createRange();
        const selection = window.getSelection();
        const tempElement = document.createElement("span");
        tempElement.textContent = email;
        document.body.appendChild(tempElement);
        range.selectNodeContents(tempElement);

        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }

        showSuccess();
        return;
      }

      throw new Error("Clipboard API not available");
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback: Show email with "Copy" instruction
      toast.info(
        <div>
          <p>Email: {email}</p>
          <p>Please copy manually</p>
        </div>,
        { duration: 5000 }
      );
    }
  };

  const showSuccess = () => {
    setCopied(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    setIsSubmitting(true);

    try {
      const result = await submitContactForm(values);

      if (result.success) {
        toast.success(
          result.message || "Your message has been sent successfully!"
        );
        form.reset();
      } else {
        toast.error(
          result.message || "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card
      className="border rounded-lg sm:border-neutral-300 shadow-sm max-w-5xl  mx-auto w-full bg-white dark:bg-neutral-950"
      suppressHydrationWarning
    >
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row items-start gap-4 md:items-center justify-between">
          <div className="flex flex-col space-y-2 sm:space-y-1">
            <h1 className="text-2xl tracking-tighter font-bold">Contact Us</h1>
            <h2 className="text-sm text-neutral-500 dark:text-neutral-400">
              Have a question or suggestion? We&apos;d love to hear from you!
            </h2>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <Mail className="hidden sm:block h-5 w-5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground flex items-center">
                <span>Email: {email}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-2 active:scale-95 transition-transform"
                  onClick={copyToClipboard}
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>You are a</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-6"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0 mt-2">
                          <FormControl>
                            <RadioGroupItem value="student" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Student
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0 mt-2">
                          <FormControl>
                            <RadioGroupItem value="staff" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Staff
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {userType === "student" && (
              <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-4 md:gap-6">
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Class</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder="Select your class"
                              className="w-full"
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="FYCM-Lin">FYCM-Lin</SelectItem>
                          <SelectItem value="FYCM-Win">FYCM-Win</SelectItem>
                          <SelectItem value="FYCM-Mac">FYCM-Mac</SelectItem>
                          <SelectItem value="SYCM-Lin">SYCM-Lin</SelectItem>
                          <SelectItem value="SYCM-Win">SYCM-Win</SelectItem>
                          <SelectItem value="SYCM-Mac">SYCM-Mac</SelectItem>
                          <SelectItem value="TYCM-Lin">TYCM-Lin</SelectItem>
                          <SelectItem value="TYCM-Win">TYCM-Win</SelectItem>
                          <SelectItem value="TYCM-Mac">TYCM-Mac</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="messageType"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Message Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select message type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="error">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              <span>Error/Bug Found</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="suggestion">
                            <div className="flex items-center gap-2">
                              <Lightbulb className="h-4 w-4 text-amber-500" />
                              <span>Improvement/Suggestion</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {userType === "staff" && (
              <FormField
                control={form.control}
                name="messageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select message type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="error">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span>Error/Bug Found</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="suggestion">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-500" />
                            <span>Improvement/Suggestion</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Message subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        messageType === "error"
                          ? "Please describe the issue or bug in detail..."
                          : "Please share your suggestion or improvement idea..."
                      }
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-1 h-4 w-4" /> Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
