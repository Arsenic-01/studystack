import { type NextRequest, NextResponse } from "next/server";
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
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  userType: z.enum(["student", "staff"]),
  class: z.string().optional(),
  messageType: z.enum(["error", "suggestion"]),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = formSchema.parse(body);

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
        return NextResponse.json({
          success: true,
          message: "Your message was received, but email notification failed.",
        });
      }

      console.log("Email sent successfully:", data);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Continue with form submission even if email fails
      return NextResponse.json({
        success: true,
        message:
          "Your message was received, but we encountered an issue with our email service.",
      });
    }

    // Here you could also save to a database if needed

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
