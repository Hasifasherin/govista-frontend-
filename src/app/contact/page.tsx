import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function ContactPage() {
  return (
    <>
      <Header />

      {/* Header Spacer */}
      <div className="h-28" />

      <main className="bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 space-y-32 font-sans">

          {/* Hero */}
          <section className="text-center max-w-2xl mx-auto mb-28">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--green-dark)] mb-6">
              Contact Govista
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              We welcome inquiries, partnerships, and feedback. Our team is
              committed to responding promptly and professionally.
            </p>
          </section>

          {/* Contact Container */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="grid md:grid-cols-2">

              {/* LEFT — Form */}
              <div className="p-10 md:p-14 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="mb-10">
                  <h2 className="text-2xl font-semibold text-[var(--green-dark)] mb-3">
                    Send a Message
                  </h2>
                  <p className="text-sm text-gray-500">
                    Complete the form below and our team will respond within 1–2 business days.
                  </p>
                </div>

                <form className="space-y-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-primary)] focus:border-transparent transition"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-primary)] focus:border-transparent transition"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-primary)] focus:border-transparent transition resize-none"
                      placeholder="How can we assist you?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--green-primary)] text-white py-3 rounded-lg text-sm font-medium hover:bg-[var(--green-dark)] transition-all duration-200 shadow-sm"
                  >
                    Submit Message
                  </button>

                </form>
              </div>

              {/* RIGHT — Info */}
              <div className="p-10 md:p-14">
                <h2 className="text-2xl font-semibold text-[var(--green-dark)] mb-10">
                  Contact Information
                </h2>

                <div className="space-y-10">

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                      Email
                    </p>
                    <p className="text-base font-medium text-[var(--green-dark)]">
                      contact@govista.com
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                      Phone
                    </p>
                    <p className="text-base font-medium text-[var(--green-dark)]">
                      +1 (555) 123-4567
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                      Office
                    </p>
                    <p className="text-base text-gray-600 leading-relaxed">
                      123 Innovation Drive<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>

                </div>

                <div className="mt-16 pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Monday – Friday · 9:00 AM – 6:00 PM (EST)
                  </p>
                </div>
              </div>

            </div>
          </section>

        </div>
      </main>

    </>
  );
}
