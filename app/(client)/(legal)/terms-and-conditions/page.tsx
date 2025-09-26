import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the Terms and Conditions for using the StudyStack platform.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-white dark:bg-black text-black dark:text-white py-24 md:py-28 lg:py-32 px-5">
      <div className="container mx-auto max-w-5xl sm:mt-4">
        <div className="bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg shadow-lg">
          <div className="p-6 text-center pb-4">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Terms and Conditions
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              <strong>Last Updated:</strong> August 31, 2025
            </p>
          </div>

          <hr className="border-neutral-300 dark:border-neutral-800 mx-6 mb-6" />

          <div className="space-y-8 px-6 pb-6">
            {/* Section 1 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                1. Acceptance of Terms
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                By accessing or using the StudyStack platform (&quot;the
                Service&quot;), you agree to be bound by these Terms and
                Conditions (&quot;Terms&quot;). This Service is a student
                project provided for educational purposes at K.K. Wagh
                Polytechnic, Nashik. If you disagree with any part of the terms,
                then you may not access the Service.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                2. User Accounts
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                User accounts for StudyStack are created and managed by
                designated faculty administrators. You are responsible for
                safeguarding the password that you use to access the Service and
                for any activities or actions under your password. You agree to
                notify an administrator immediately upon becoming aware of any
                breach of security or unauthorized use of your account.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                3. Acceptable Use
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                You agree to use the Service only for lawful, educational
                purposes related to your coursework. You agree not to use the
                Service:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-neutral-500 dark:text-neutral-400 text-base mt-4">
                <li>
                  In any way that violates any applicable local, national, or
                  international law or regulation.
                </li>
                <li>
                  To upload or distribute any material that is unlawful,
                  defamatory, harassing, abusive, fraudulent, obscene, or is
                  otherwise objectionable.
                </li>
                <li>
                  To infringe on the intellectual property rights of others.
                </li>
                <li>
                  To attempt to gain unauthorized access to, interfere with,
                  damage, or disrupt any parts of the Service, the server on
                  which the Service is stored, or any server, computer, or
                  database connected to the Service.
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                4. Intellectual Property and Content
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                The Service and its original content (excluding content provided
                by users), features, and functionality are and will remain the
                exclusive property of the student developers and K.K. Wagh
                Polytechnic. Content uploaded by faculty remains the
                intellectual property of its respective owner. Please refer to
                our{" "}
                <a
                  href="/copyright-policy"
                  className="text-blue-500 hover:underline"
                >
                  Copyright Policy
                </a>{" "}
                for detailed information.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                5. Disclaimer of Warranties
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                The Service is provided on an &quot;AS IS&quot; and &quot;AS
                AVAILABLE&quot; basis. As a student project, it is provided
                without warranties of any kind, whether express or implied,
                including, but not limited to, implied warranties of
                merchantability, fitness for a particular purpose, or
                non-infringement. We do not warrant that the Service will be
                uninterrupted, secure, or free from errors.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                6. Limitation of Liability
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                In no event shall the student developers, faculty guides, or
                K.K. Wagh Polytechnic be liable for any indirect, incidental,
                special, consequential, or punitive damages, including without
                limitation, loss of data, or other intangible losses, resulting
                from your access to or use of, or inability to access or use,
                the Service.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                7. Termination
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                We may terminate or suspend your account and bar access to the
                Service immediately, without prior notice or liability, for any
                reason whatsoever, including without limitation if you breach
                the Terms.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                8. Governing Law
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                These Terms shall be governed and construed in accordance with
                the laws of India, with jurisdiction in Nashik, Maharashtra,
                without regard to its conflict of law provisions.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                9. Contact Information
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                For any questions regarding these Terms and Conditions, please
                contact our project guide, Prof. A. D. Talole or Prof. G. B.
                Katkade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
