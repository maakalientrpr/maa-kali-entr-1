export const metadata = {
  title: "Privacy Policy | Maa Kali Enterprise",
};

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-700">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mt-2">Last Updated: December 2025</p>
        </div>

        <p>
          At Maa Kali Enterprise, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">1. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Personal Information:</strong> Name, Email address, Phone number, and Address when you register or book a service.</li>
            <li><strong>Travel Details:</strong> Passenger names, ages, and dietary preferences required for booking logistics.</li>
            <li><strong>Payment Information:</strong> Transaction details processed securely via our payment partners (Razorpay). We do not store credit card details on our servers.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">2. How We Use Your Information</h2>
          <p>We use your data to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Process bookings for tours, hotels, and transport.</li>
            <li>Send booking confirmations, invoices, and travel updates via Email/WhatsApp.</li>
            <li>Improve our website and customer service experience.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">3. Data Sharing</h2>
          <p>
            We do not sell your data. We only share necessary information with third parties essential for your trip, such as:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Hotels, Transport Providers, and Event Coordinators.</li>
            <li>Payment Gateways (for processing transactions).</li>
            <li>Legal authorities if required by law.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">4. Cookies</h2>
          <p>
            Our website uses cookies to enhance user experience and analyze website traffic. You can choose to disable cookies through your browser settings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">5. Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal data. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="space-y-4 border-t pt-6">
          <h2 className="text-xl font-semibold text-slate-900">Contact Privacy Officer</h2>
          <p>
            For concerns regarding your data, contact us at:<br />
            Email: maakalienterprise@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}