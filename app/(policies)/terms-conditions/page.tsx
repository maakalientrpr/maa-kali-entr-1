export const metadata = {
  title: "Terms & Conditions | Maa Kali Enterprise",
};

export default function TermsConditions() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-700">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-slate-900">Terms & Conditions</h1>
          <p className="text-sm text-slate-500 mt-2">Last Updated: December 2025</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">1. Introduction</h2>
          <p>
            Welcome to Maa Kali Enterprise. These Terms and Conditions govern your use of our website and the purchase of our tour packages, pilgrimage services, and event management services. By accessing or using our services, you agree to be bound by these terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">2. Booking & Payments</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To confirm a booking, an advance payment or full payment (as specified per package) is required.</li>
            <li>We use secure third-party payment gateways (Razorpay) for transactions. We do not store your banking passwords or PINs.</li>
            <li>Prices are subject to change without prior notice until the booking is confirmed.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">3. Services</h2>
          <p>
            Maa Kali Enterprise acts as an aggregator and service provider. While we strive to provide the best experience:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Itinerary changes may occur due to weather, political situations, or unforeseen circumstances.</li>
            <li>Hotel availability is subject to confirmation. Equivalent alternatives will be provided if specific hotels are unavailable.</li>
            <li>For pilgrimage tours, darshan timings and entry are subject to temple authorities.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">4. User Responsibilities</h2>
          <p>
            You agree to provide accurate information during booking. You are responsible for carrying valid identification documents (Aadhar/Voter ID) during the tour.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">5. Limitation of Liability</h2>
          <p>
            Maa Kali Enterprise shall not be liable for any injury, loss, claim, or damage resulting from force majeure events, including but not limited to natural disasters, strikes, or transportation delays.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">6. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts in Kolkata, West Bengal.
          </p>
        </section>

        <section className="space-y-4 border-t pt-6">
          <h2 className="text-xl font-semibold text-slate-900">Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:<br />
            <strong>Maa Kali Enterprise</strong><br />
            123, Spiritual Road, Kolkata, West Bengal - 700001<br />
            Email: maakalienterprise@gmail.com<br />
            Phone: +91 9330942690
          </p>
        </section>
      </div>
    </div>
  );
}