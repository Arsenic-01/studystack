import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn more about our cookie policy and how we use cookies on StudyStack.",
};

export default function CookiePolicyPage() {
  return (
    <main className="bg-white dark:bg-black text-black dark:text-white py-24 md:py-28 lg:py-32 px-5">
      <div className="container mx-auto max-w-5xl sm:mt-4">
        <div className="bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg shadow-lg">
          <div className="p-6 text-center pb-4">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Cookie Policy
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
                1. What Are Cookies?
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                Cookies are small text files stored on your computer or mobile
                device when you visit a website. They are widely used to make
                websites work, or work more efficiently, as well as to provide
                information to the owners of the site.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                2. How We Use Cookies
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base mb-4">
                StudyStack uses cookies for several essential purposes. We do
                not use cookies for advertising. The types of cookies we use
                are:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-neutral-500 dark:text-neutral-400 text-base">
                <li>
                  <strong>Strictly Necessary Cookies:</strong> These cookies are
                  essential for you to browse the application and use its
                  features, such as accessing secure areas. Without these
                  cookies, services like logging into your account cannot be
                  provided. Our authentication system (powered by Appwrite and
                  NextAuth) relies on these cookies to keep you logged in
                  securely during your session.
                </li>
                <li>
                  <strong>Performance and Analytics Cookies:</strong> These
                  cookies collect information about how you use our platform,
                  for instance, which pages you go to most often and if you get
                  error messages. We use PostHog to collect this data, which
                  helps us understand how our features are used and how we can
                  improve the user experience. All information these cookies
                  collect is aggregated and therefore anonymous.
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                3. Third-Party Cookies
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base mb-4">
                Some of our third-party services may also use cookies. These
                include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-500 dark:text-neutral-400 text-base">
                <li>
                  <strong>Appwrite:</strong> Used for authentication and session
                  management.
                </li>
                <li>
                  <strong>PostHog:</strong> Used to distinguish users for
                  analytics purposes.
                </li>
              </ul>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base mt-4">
                We do not control the setting of these cookies, so we suggest
                you check the third-party websites for more information about
                their cookies and how to manage them.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                4. Your Choices Regarding Cookies
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                You have the right to decide whether to accept or reject
                cookies. You can exercise your cookie rights by setting your
                preferences in your web browser. Most browsers allow you to
                manage your cookie preferences through their settings.
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base mt-4">
                Please note that if you choose to block or delete cookies,
                certain essential features of StudyStack, such as logging in,
                will cease to function.
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base mt-4">
                For more information on how to manage cookies, you can visit{" "}
                <a
                  href="https://www.allaboutcookies.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  allaboutcookies.org
                </a>
                .
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                5. Changes to This Cookie Policy
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                We may update this Cookie Policy from time to time. We will
                notify you of any changes by posting the new Cookie Policy on
                this page.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                6. Contact Us
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                If you have any questions about our use of cookies, please
                contact us or your project guide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
