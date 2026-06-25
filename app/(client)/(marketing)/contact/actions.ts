"use server";

import { z } from "zod";
import { Resend } from "resend";
import ContactFormEmail from "@/emails/ContactFormEmail";
import { contactFormSchema } from "@/validation";
import { cacheLife } from "next/cache";
import { DATABASE_ID, db, Query, USER_COLLECTION_ID } from "@/lib/appwrite";
import QueryEmail from "@/emails/QueryFormEmail";

// Check if API key exists, otherwise use a placeholder for development
const resendApiKey = process.env.RESEND_API_KEY || "";

// Initialize Resend with proper error handling
const resend = (() => {
  try {
    if (!resendApiKey) {
      console.warn(
        "RESEND_API_KEY is not set. Email functionality will be simulated.",
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

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export async function submitContactForm(formData: ContactFormValues) {
  try {
    // Validate the form data
    const validatedData = contactFormSchema.parse(formData);

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
      console.log("Form processed successfully despite email error");
      return {
        success: true,
        message:
          "Your message was received, but we encountered an issue with our email service.",
      };
    }

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

export async function getTeachers() {
  "use cache";
  cacheLife("days");

  try {
    const response = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
      Query.equal("role", "teacher"),
      Query.limit(100),
    ]);
    return response.documents.map((doc) => ({
      id: doc.$id,
      name: doc.name,
      email: doc.email,
      prnNo: doc.prnNo,
    }));
  } catch (error) {
    console.error("Failed to fetch teachers from Appwrite:", error);
    return [];
  }
}

export async function sendQueryEmail(payload: {
  teacherEmail: string;
  teacherName: string;
  studentName: string;
  studentEmail: string;
  subject: string;
  message: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "StudyStack Queries <onboarding@resend.dev>",
      // to: [payload.teacherEmail],
      to: "studystack01@gmail.com", // For testing purposes, send to a fixed email
      replyTo: payload.studentEmail,
      subject: `[Student Query] ${payload.subject}`,
      react: QueryEmail({
        teacherName: payload.teacherName,
        studentName: payload.studentName,
        studentEmail: payload.studentEmail,
        subject: payload.subject,
        markdownMessage: payload.message,
      }),
    });

    if (error) {
      console.error("Resend API Error:", error);
      return {
        success: false,
        message: "Failed to route the email. Please try again.",
      };
    }

    console.log("data sent : ", data);

    return {
      success: true,
      message: "Your query has been sent to the professor successfully!",
    };
  } catch (error) {
    console.error("Unexpected error sending query:", error);
    return { success: false, message: "An unexpected server error occurred." };
  }
}
