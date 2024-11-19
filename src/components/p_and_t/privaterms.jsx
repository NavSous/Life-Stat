import React from 'react'

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include your name, email address, and any other information you choose to provide.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Information Sharing and Disclosure</h2>
        <p className="mb-4">
          We do not share your personal information with third parties except as described in this policy or with your consent.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
        <p className="mb-4">
          We use reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Use of Firebase</h2>
        <p className="mb-4">
          LifeStat uses Firebase, a platform developed by Google, for various backend services including authentication and data storage. Firebase collects and processes data as described in the Google Privacy Policy. We do not have direct access to this data, and it is managed securely by Firebase.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking Technologies</h2>
        <p className="mb-4">
          LifeStat does not use non-functional cookies. We only use essential cookies necessary for the functioning of our service. For analytics purposes, we use backend service providers that may use cookies or similar tracking technologies to collect aggregated and anonymized usage data. This data helps us improve our services but does not personally identify you.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
        <p className="mb-4">
          You have the right to access, update, or delete your personal information. You can do this through your account settings or by contacting us directly.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@lifestat.com
        </p>
      </section>
    </div>
  )
}

export default Privacy