import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Link,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface ContactFormEmailProps {
  name: string;
  email: string;
  phone: string;
  userType: "student" | "staff";
  class: string;
  messageType: "error" | "suggestion";
  subject: string;
  message: string;
}

export default function ContactFormEmail({
  name,
  email,
  phone,
  userType,
  class: className,
  messageType,
  subject,
  message,
}: ContactFormEmailProps) {
  const previewText = `New ${messageType === "error" ? "Bug Report" : "Suggestion"} from ${name}: ${subject}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#f5f5f7] font-sans">
          <Container className="mx-auto my-10 max-w-[600px] bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <Section className="bg-[#fafafa] px-8 py-6 text-center border-b border-[#eaeaea]">
              <Heading className="text-[#1d1d1f] text-2xl font-semibold m-0">
                {messageType === "error" ? "Bug Report" : "Feature Suggestion"}
              </Heading>
            </Section>

            {/* Main Content */}
            <Container className="px-8 py-8">
              {/* Subject */}
              <Heading className="text-[#1d1d1f] text-xl font-medium mb-4">
                {subject}
              </Heading>

              {/* Message */}
              <Text className="text-[#1d1d1f] text-base leading-6 mb-6 whitespace-pre-wrap">
                {message}
              </Text>

              <Hr className="border-[#eaeaea] my-6" />

              {/* Contact Information */}
              <Heading className="text-[#1d1d1f] text-lg font-medium mb-4">
                Contact Information
              </Heading>

              <Section className="bg-[#f5f5f7] rounded-lg p-5 mb-6">
                <Row className="mb-3">
                  <Column className="w-1/3 text-[#6e6e73] text-sm">
                    Name:
                  </Column>
                  <Column className="w-2/3 text-[#1d1d1f]">{name}</Column>
                </Row>

                <Row className="mb-3">
                  <Column className="w-1/3 text-[#6e6e73] text-sm">
                    Email:
                  </Column>
                  <Column className="w-2/3">
                    <Link
                      href={`mailto:${email}`}
                      className="text-[#007AFF] no-underline"
                    >
                      {email}
                    </Link>
                  </Column>
                </Row>

                <Row className="mb-3">
                  <Column className="w-1/3 text-[#6e6e73] text-sm">
                    Phone:
                  </Column>
                  <Column className="w-2/3 text-[#1d1d1f]">{phone}</Column>
                </Row>

                <Row className="mb-3">
                  <Column className="w-1/3 text-[#6e6e73] text-sm">
                    Role:
                  </Column>
                  <Column className="w-2/3 text-[#1d1d1f]">
                    {userType === "student" ? "Student" : "Staff"}
                  </Column>
                </Row>

                {userType === "student" && (
                  <Row>
                    <Column className="w-1/3 text-[#6e6e73] text-sm">
                      Class:
                    </Column>
                    <Column className="w-2/3 text-[#1d1d1f]">
                      {className}
                    </Column>
                  </Row>
                )}
              </Section>

              {/* Support Note */}
              <Text className="text-[#1d1d1f] text-base leading-6 mb-4">
                Please review the above{" "}
                {messageType === "error" ? "bug report" : "suggestion"} and take
                appropriate action.
              </Text>
            </Container>

            {/* Footer */}
            <Section className="bg-[#fafafa] px-8 py-6 text-center border-t border-[#eaeaea]">
              <Text className="text-[#86868b] text-sm leading-6 mb-4">
                This is an automated email from the StudyStack contact form.
                Please do not reply directly to this email.
              </Text>
              <Text className="text-[#86868b] text-xs leading-5 mt-4">
                &copy; {new Date().getFullYear()} StudyStack @ K.K.Wagh
                Polytechnic. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
