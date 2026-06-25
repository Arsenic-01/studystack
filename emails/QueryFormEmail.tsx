import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Markdown } from "@react-email/markdown";
import { Tailwind } from "@react-email/tailwind";

interface QueryEmailProps {
  teacherName: string;
  studentName: string;
  studentEmail: string;
  subject: string;
  markdownMessage: string;
}

export default function QueryEmail({
  teacherName = "Professor",
  studentName,
  studentEmail,
  subject,
  markdownMessage,
}: QueryEmailProps) {
  const previewText = `New Student Query from ${studentName} from Query Form`;

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
                New Student Query
              </Heading>
            </Section>

            {/* Main Content */}
            <Container className="px-8 py-8">
              <Text className="text-[#1d1d1f] text-base leading-6 mb-6">
                Hello {teacherName},
              </Text>

              {/* Subject */}
              <Heading className="text-[#1d1d1f] text-xl font-medium mb-4">
                {subject}
              </Heading>

              {/* Markdown Message Section */}
              <Section className="mb-6">
                <Markdown
                  markdownCustomStyles={{
                    p: {
                      color: "#1d1d1f",
                      fontSize: "16px",
                      lineHeight: "24px",
                      margin: "0 0 16px 0",
                    },
                    h1: {
                      color: "#1d1d1f",
                      fontSize: "24px",
                      fontWeight: "600",
                      margin: "24px 0 16px 0",
                    },
                    h2: {
                      color: "#1d1d1f",
                      fontSize: "20px",
                      fontWeight: "600",
                      margin: "24px 0 16px 0",
                    },
                    h3: {
                      color: "#1d1d1f",
                      fontSize: "18px",
                      fontWeight: "600",
                      margin: "24px 0 16px 0",
                    },
                    codeInline: {
                      backgroundColor: "#f5f5f7",
                      padding: "3px 6px",
                      borderRadius: "4px",
                      fontFamily: "monospace",
                      fontSize: "14px",
                      color: "#1d1d1f",
                      border: "1px solid #eaeaea",
                    },
                    codeBlock: {
                      backgroundColor: "#1d1d1f",
                      padding: "16px",
                      borderRadius: "8px",
                      fontFamily: "monospace",
                      fontSize: "14px",
                      color: "#f5f5f7",
                      overflowX: "auto",
                      margin: "0 0 16px 0",
                    },
                    ul: {
                      paddingLeft: "24px",
                      margin: "0 0 16px 0",
                      color: "#1d1d1f",
                      fontSize: "16px",
                    },
                    ol: {
                      paddingLeft: "24px",
                      margin: "0 0 16px 0",
                      color: "#1d1d1f",
                      fontSize: "16px",
                    },
                    li: { marginBottom: "8px", lineHeight: "24px" },
                    link: { color: "#007AFF", textDecoration: "none" },
                    blockQuote: {
                      borderLeft: "4px solid #eaeaea",
                      paddingLeft: "16px",
                      color: "#6e6e73",
                      fontStyle: "italic",
                      margin: "0 0 16px 0",
                    },
                    hr: { borderColor: "#eaeaea", margin: "24px 0" },
                  }}
                >
                  {markdownMessage}
                </Markdown>{" "}
              </Section>

              <Hr className="border-[#eaeaea] my-6" />

              {/* Student Information */}
              <Heading className="text-[#1d1d1f] text-lg font-medium mb-4">
                Student Details
              </Heading>

              <Section className="bg-[#f5f5f7] rounded-lg p-5 mb-6">
                <Row className="mb-3">
                  <Column className="w-1/3 text-[#6e6e73] text-sm">
                    Name:
                  </Column>
                  <Column className="w-2/3 text-[#1d1d1f]">
                    {studentName}
                  </Column>
                </Row>

                <Row>
                  <Column className="w-1/3 text-[#6e6e73] text-sm">
                    Email:
                  </Column>
                  <Column className="w-2/3">
                    <Link
                      href={`mailto:${studentEmail}`}
                      className="text-[#007AFF] no-underline"
                    >
                      {studentEmail}
                    </Link>
                  </Column>
                </Row>
              </Section>

              {/* Support Note */}
              <Text className="text-[#1d1d1f] text-base leading-6 mb-4 font-medium">
                You can reply directly to this email to answer the student.
              </Text>
            </Container>

            {/* Footer */}
            <Section className="bg-[#fafafa] px-8 py-6 text-center border-t border-[#eaeaea]">
              <Text className="text-[#86868b] text-sm leading-6 mb-4">
                This query was submitted via the StudyStack platform.
              </Text>
              <Text className="text-[#86868b] text-xs leading-5 mt-4">
                &copy; {new Date().getFullYear()} StudyStack @ K.K. Wagh
                Polytechnic ©. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
