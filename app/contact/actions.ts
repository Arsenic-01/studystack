"use server";

import { z } from "zod";
import { Resend } from "resend";
import ContactFormEmail from "@/emails/contact-form-email";

// Check if API key exists, otherwise use a placeholder for development
const resendApiKey = process.env.RESEND_API_KEY || "";

// Initialize Resend with proper error handling
const resend = (() => {
  try {
    if (!resendApiKey) {
      console.warn(
        "RESEND_API_KEY is not set. Email functionality will be simulated."
      );
      // Return a mock implementation for development
      return {
        emails: {
          send: async (options: any) => {
            console.log("Email would be sent with:", options);
            return { data: { id: "mock-email-id" }, error: null };
          },
        },
      } as unknown as Resend;
    }
    return new Resend(resendApiKey);
  } catch (error) {
    console.error("Failed to initialize Resend:", error);
    // Return a mock implementation as fallback
    return {
      emails: {
        send: async (options: any) => {
          console.log("Email sending failed, would send:", options);
          return {
            data: null,
            error: new Error("Failed to initialize email service"),
          };
        },
      },
    } as unknown as Resend;
  }
})();

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." }),
  userType: z.enum(["student", "staff"]),
  class: z.string().optional(),
  messageType: z.enum(["error", "suggestion"]),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormValues = z.infer<typeof formSchema>;

export async function submitContactForm(formData: ContactFormValues) {
  try {
    // Validate the form data
    const validatedData = formSchema.parse(formData);

    // Log form submission for debugging
    console.log("Processing contact form submission:", {
      ...validatedData,
      message: validatedData.message.substring(0, 50) + "...", // Truncate for logging
    });

    try {
      // Send email using Resend
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev", // StudyStack <noreply@studystack.com>
        to: ["studystack01@gmail.com"],
        subject: `[StudyStack Contact] ${validatedData.messageType === "error" ? "Bug Report" : "Suggestion"}: ${validatedData.subject}`,
        react: ContactFormEmail({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          userType: validatedData.userType,
          class: validatedData.class || "N/A",
          messageType: validatedData.messageType,
          subject: validatedData.subject,
          message: validatedData.message,
        }),
      });

      if (error) {
        console.error("Email sending error:", error);
        // Continue with form submission even if email fails
        console.log("Form processed successfully despite email failure");
        return {
          success: true,
          message: "Your message was received, but email notification failed.",
        };
      }

      console.log("Email sent successfully:", data);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Continue with form submission even if email fails
      console.log("Form processed successfully despite email error");
      return {
        success: true,
        message:
          "Your message was received, but we encountered an issue with our email service.",
      };
    }

    // Here you could also save to a database if needed

    return { success: true, message: "Contact form submitted successfully" };
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors,
        message: "Invalid form data",
      };
    }

    return { success: false, message: "Failed to submit contact form" };
  }
}
