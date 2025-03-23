import React from "react";

interface PasswordResetEmailProps {
  userName: string;
  resetLink: string;
}

const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  userName = "User",
  resetLink = "https://example.com/reset",
}) => {
  // Safe default value for userName
  const safeUserName = userName || "User";

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        margin: "0 auto",
        padding: "0",
        maxWidth: "600px",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          backgroundColor: "#fafafa",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <h1
          style={{
            color: "#1d1d1f",
            fontSize: "24px",
            fontWeight: "600",
            lineHeight: "1.2",
            margin: "8px 0",
          }}
        >
          Password Reset
        </h1>
      </div>

      {/* Main Content */}
      <div
        style={{
          padding: "32px 24px",
          backgroundColor: "#ffffff",
        }}
      >
        <p
          style={{
            color: "#1d1d1f",
            fontSize: "16px",
            lineHeight: "1.5",
            margin: "0 0 24px",
          }}
        >
          Hello {safeUserName},
        </p>

        <p
          style={{
            color: "#1d1d1f",
            fontSize: "16px",
            lineHeight: "1.5",
            margin: "0 0 24px",
          }}
        >
          We received a request to reset your password. If you didn&apos;t make
          this request, you can safely ignore this email.
        </p>

        <p
          style={{
            color: "#1d1d1f",
            fontSize: "16px",
            lineHeight: "1.5",
            margin: "0 0 24px",
          }}
        >
          To reset your password, click the button below:
        </p>

        {/* Reset Button */}
        <div
          style={{
            textAlign: "center",
            margin: "32px 0",
          }}
        >
          <a
            href={resetLink}
            style={{
              backgroundColor: "#007AFF",
              borderRadius: "8px",
              color: "#ffffff",
              display: "inline-block",
              fontSize: "16px",
              fontWeight: "500",
              letterSpacing: "0.15px",
              padding: "12px 24px",
              textDecoration: "none",
              textAlign: "center",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            Reset Password
          </a>
        </div>

        <p
          style={{
            color: "#1d1d1f",
            fontSize: "16px",
            lineHeight: "1.5",
            margin: "0 0 24px",
          }}
        >
          This link will expire in 1 hour for security reasons.
        </p>

        <p
          style={{
            color: "#1d1d1f",
            fontSize: "16px",
            lineHeight: "1.5",
            margin: "0 0 24px",
          }}
        >
          If you&apos;re having trouble clicking the button, copy and paste the
          URL below into your browser:
        </p>

        <p
          style={{
            color: "#6e6e73",
            fontSize: "14px",
            lineHeight: "1.5",
            margin: "0 0 24px",
            padding: "12px",
            backgroundColor: "#f5f5f7",
            borderRadius: "6px",
            wordBreak: "break-all",
          }}
        >
          {resetLink}
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          backgroundColor: "#fafafa",
          borderTop: "1px solid #eaeaea",
        }}
      >
        <p
          style={{
            color: "#86868b",
            fontSize: "14px",
            lineHeight: "1.5",
            margin: "0 0 16px",
          }}
        >
          If you didn&apos;t request a password reset, please ignore this email
          or contact support if you have concerns.
        </p>

        <p
          style={{
            color: "#86868b",
            fontSize: "12px",
            lineHeight: "1.5",
            margin: "16px 0 0",
          }}
        >
          &copy; {new Date().getFullYear()} StudyStack @ K.K.Wagh Polytechinc.
          All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PasswordResetEmail;
