import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import ContactFormEmail from "@/emails/ContactFormEmail";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    try {
      const { data, error } = await resend.emails.send({
        from: "<noreply@studystack.com>", // StudyStack <noreply@studystack.com>
        to: ["studystack01@gmail.com"],
        subject: `[StudyStack Contact] ${body.messageType === "error" ? "Bug Report" : "Suggestion"}: ${body.subject}`,
        react: ContactFormEmail({
          name: body.name,
          email: body.email,
          phone: body.phone,
          userType: body.userType,
          class: body.class || "N/A",
          messageType: body.messageType,
          subject: body.subject,
          message: body.message,
        }),
      });

      if (error) {
        console.error("Email sending error:", error);
        return NextResponse.json(
          {
            success: true,
            message:
              "Your message was received, but email notification failed.",
            error,
          },
          { status: 200 }
        );
      }

      return NextResponse.json({ data });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      return NextResponse.json(
        {
          success: true,
          message:
            "Your message was received, but we encountered an issue with our email service.",
          error: "Email service error",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Request processing error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
