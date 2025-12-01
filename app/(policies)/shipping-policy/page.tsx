export const metadata = {
  title: "Shipping & Delivery Policy | Maa Kali Enterprise",
};

export default function ShippingPolicy() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-700">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-slate-900">Shipping & Delivery Policy</h1>
          <p className="text-sm text-slate-500 mt-2">
            Applicable for Service-Based Transactions
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">1. Nature of Goods</h2>
          <p>
            Maa Kali Enterprise deals exclusively in <strong>Services</strong> (Tour Packages, Pilgrimage Bookings, Event Management, and Catering). We do not sell or ship physical products that require logistics or courier services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">2. Mode of Delivery</h2>
          <p>
            Upon successful payment for a booking:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Booking Confirmation:</strong> You will receive an immediate confirmation via <strong>Email</strong> and <strong>SMS/WhatsApp</strong>.</li>
            <li><strong>Tickets & Vouchers:</strong> E-Tickets, Hotel Vouchers, and Itinerary details will be sent to your registered email address within 24-48 hours of booking confirmation.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">3. Support</h2>
          <p>
            If you do not receive your confirmation details within the specified time, please contact our support team immediately at <strong>+91 9330942690</strong> or email <strong>maakalienterprise@gmail.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}