import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn more about our privacy policy and how we handle your data on StudyStack.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white dark:bg-black text-black dark:text-white py-24 md:py-28 lg:py-32 px-5">
      <div className="container mx-auto max-w-5xl sm:mt-4">
        <div className="bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg shadow-lg">
          <div className="p-6 text-center pb-4">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Privacy Policy
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
                1. Introduction
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                Welcome to StudyStack. This platform is a final-year project
                designed for the students and faculty of the Computer Technology
                department at K.K. Wagh Polytechnic, Nashik. We are committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our application.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                2. Information We Collect
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base mb-4">
                We may collect information about you in a variety of ways. The
                information we may collect on the Service includes:
              </p>

              <h3 className="text-md lg:text-lg font-semibold mt-4 mb-2">
                a. Personal Data You Provide to Us
              </h3>
              <ul className="list-disc pl-6 space-y-3 text-neutral-500 dark:text-neutral-400 text-base">
                <li>
                  <strong>Account Information:</strong> To provide you with
                  access to the platform, an administrator will create an
                  account on your behalf. During this process, we collect
                  personal information such as your full name, email address,
                  and student/faculty identification number (PRN).
                </li>
                <li>
                  <strong>User Content:</strong> We collect the files, notes,
                  links, and other information you upload or create on the
                  platform to provide the service.
                </li>
              </ul>

              <h3 className="text-md lg:text-lg font-semibold mt-6 mb-2">
                b. Data We Collect Automatically
              </h3>
              <ul className="list-disc pl-6 space-y-3 text-neutral-500 dark:text-neutral-400 text-base">
                <li>
                  <strong>Usage Data:</strong> We automatically collect
                  information about your interactions with our service, such as
                  your IP address and pages viewed. We use PostHog for product
                  analytics to understand feature usage and improve the
                  platform.
                </li>
                <li>
                  <strong>Error and Performance Data:</strong> To maintain
                  stability, we use Sentry to automatically collect information
                  about application errors, which may include your device type
                  and browser.
                </li>
                <li>
                  <strong>Search Data:</strong> Your search queries are
                  processed by Algolia to provide fast and relevant results.
                </li>
                <li>
                  <strong>Cookies and Session Data:</strong> We use cookies to
                  maintain your login session. Please see our{" "}
                  <a
                    href="/cookie-policy"
                    className="text-blue-500 hover:underline"
                  >
                    Cookie Policy
                  </a>{" "}
                  for more details.
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-neutral-500 dark:text-neutral-400 text-base">
                <li>
                  To create and manage your account and provide our services.
                </li>
                <li>
                  To enable you to upload, access, and share educational
                  resources.
                </li>
                <li>
                  To improve the functionality and user experience of our
                  platform using analytics.
                </li>
                <li>
                  To monitor, analyze, and fix application errors to ensure
                  stability.
                </li>
                <li>
                  To ensure the security of the platform and prevent fraudulent
                  activity.
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                4. Sharing Your Information
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base mb-4">
                We do not sell your personal information. We may share
                information with third-party vendors that support our platform,
                including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-500 dark:text-neutral-400 text-base">
                <li>
                  <strong>Appwrite:</strong> Our backend, database, and
                  authentication provider.
                </li>
                <li>
                  <strong>Algolia:</strong> Our search service provider.
                </li>
                <li>
                  <strong>Sentry:</strong> Our error tracking and performance
                  monitoring service.
                </li>
                <li>
                  <strong>PostHog:</strong> Our product analytics service.
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                5. Data Security
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                We use administrative, technical, and physical security measures
                to help protect your personal information. While we have taken
                reasonable steps to secure your data, please be aware that no
                security measures are perfect or impenetrable.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                6. Your Data Rights
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                You have the right to access your personal information on the
                platform. However, your core account details (such as your name,
                email, and PRN) are managed by administrators and cannot be
                changed directly by you. If you need to correct this
                information, please contact your designated faculty
                administrator.
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base mt-4">
                You retain full control over your password and can change it at
                any time through your account settings or use the &quot;Forgot
                Password&quot; functionality. To request account deletion,
                please contact an administrator.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                7. Changes to This Privacy Policy
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &quot;Last Updated&quot; date.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                8. Contact Us
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                If you have any questions about this Privacy Policy, please
                contact us or our project guide, Prof. A. D. Talole or Prof. G.
                B. Katkade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
