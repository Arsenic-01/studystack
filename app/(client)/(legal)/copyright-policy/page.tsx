import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copyright Policy",
  description:
    "Review the Copyright Policy for StudyStack, covering platform and user-generated content.",
};

export default function CopyrightPolicyPage() {
  return (
    <main className="bg-white dark:bg-black text-black dark:text-white py-24 md:py-28 lg:py-32 px-5">
      <div className="container mx-auto max-w-5xl sm:mt-4">
        <div className="bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg shadow-lg">
          <div className="p-6 text-center pb-4">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Copyright Policy
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
                1. Overview
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                This Copyright Policy outlines the ownership of materials on the
                StudyStack platform. It covers the platform itself, the content
                uploaded by faculty, and the rights and responsibilities of all
                users. We respect the intellectual property rights of others and
                expect our users to do the same.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                2. Platform Ownership
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                The StudyStack name, logo, source code, design, and all related
                visual elements and functionalities are the exclusive property
                of the student developers and K.K. Wagh Polytechnic, Nashik. All
                rights are reserved.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                3. User-Generated Content
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                Faculty and authorized users (&quot;Content Creators&quot;) may
                upload educational materials, including but not limited to
                notes, documents, presentations, and links
                (&quot;Content&quot;).
              </p>
              <ul className="list-disc pl-6 space-y-3 text-neutral-500 dark:text-neutral-400 text-base mt-4">
                <li>
                  <strong>Ownership:</strong> Content Creators retain full
                  copyright ownership of the materials they upload.
                </li>
                <li>
                  <strong>License to StudyStack:</strong> By uploading Content,
                  you grant StudyStack a non-exclusive, royalty-free, worldwide
                  license to display, reproduce, and distribute that Content
                  solely for the purpose of operating and providing the
                  educational services of this platform to its intended users.
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                4. Permitted Use by Students
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                Students and other end-users are granted a limited license to
                access and use the Content available on StudyStack strictly for
                personal, non-commercial, and educational purposes related to
                their coursework at K.K. Wagh Polytechnic. Unauthorized
                distribution, reproduction, or commercial use of any Content is
                strictly prohibited.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                5. Open Source Software
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                The source code for the StudyStack platform is made available on
                GitHub under the MIT License. This license pertains only to the
                platform&apos;s code and does not extend to the user-generated
                academic Content stored within the application. You are free to
                fork, modify, and use the code in accordance with the terms of
                the MIT License.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                6. Reporting Copyright Infringement
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                If you believe that any Content available on StudyStack
                infringes upon your copyright, please notify us by contacting a
                project administrator or faculty guide. Please provide a
                detailed description of the copyrighted work that you claim has
                been infringed and where the material is located on our
                platform. We will take appropriate action, including the removal
                of the infringing material, upon verification of the claim.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold mb-2">
                7. Contact Information
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
                For any questions regarding this Copyright Policy, please
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
