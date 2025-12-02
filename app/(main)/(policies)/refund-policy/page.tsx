export const metadata = {
  title: "Refund & Cancellation Policy | Maa Kali Enterprise",
};

export default function RefundPolicy() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-700">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-slate-900">Refund & Cancellation Policy</h1>
          <p className="text-sm text-slate-500 mt-2">
            Transparency is key to our relationship. Please read our policy carefully.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">1. Cancellation Rules</h2>
          <p>
            If you wish to cancel your booking, you must notify us in writing via email at <strong>maakalientrpr@gmail.com</strong> or via WhatsApp. The following charges apply:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>30 days or more before departure:</strong> 25% of total tour cost (Service Charge) will be deducted.</li>
            <li><strong>15 to 29 days before departure:</strong> 50% of total tour cost will be deducted.</li>
            {/* <li><strong>7 to 14 days before departure:</strong> 50% of total tour cost will be deducted.</li> */}
            <li><strong>Less than 15 days before departure:</strong> No Refund (100% cancellation charge).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">2. Refund Processing</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Once a cancellation is approved, the refund amount will be calculated based on the policy above.</li>
            <li>The amount will be credited back to the <strong>original source of payment</strong> (Credit Card, Debit Card, UPI, or Bank Account).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">3. Event Management Cancellation</h2>
          <p>
            For catering and event management services:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Advances paid for venue booking or raw materials are non-refundable if cancelled within 7 days of the event.</li>
            <li>Rescheduling is subject to availability and may incur additional charges.</li>
          </ul>
        </section>

        {/* <section className="space-y-4 border-t pt-6">
          <p className="text-sm text-slate-500">
            Note: In case of tour cancellation by Maa Kali Enterprise due to unavoidable circumstances (like natural calamities), a full refund or alternative tour dates will be provided.
          </p>
        </section> */}
      </div>
    </div>
  );
}