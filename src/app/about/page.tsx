"use client";

import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <>
      <div className="h-28" />

      <main className="bg-gray-50 pt-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 space-y-24 font-sans">

          {/* Hero Section */}
          <section className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--green-dark)] mb-6">
              Travel, Made Simple.
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Govista connects travelers with trusted local experiences through
              a seamless, reliable marketplace designed for clarity, confidence,
              and meaningful journeys.
            </p>

            <button
              onClick={() => router.push("/")}
              className="bg-[var(--green-primary)] text-white px-8 py-3 text-sm font-medium rounded-lg hover:bg-[var(--green-dark)] transition"
            >
              Explore Experiences
            </button>
          </section>

          {/* About */}
          <section className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-[var(--green-dark)] mb-6">
              Who We Are
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Govista was built to remove friction from travel planning.
              We bring together verified operators and modern technology to
              make discovering and booking experiences effortless.
              <br /><br />
              Our focus is simple — better journeys for travelers and sustainable
              growth for travel partners worldwide.
            </p>
          </section>

          {/* Mission & Vision */}
          <section className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto pt-10 border-t border-gray-200">

            <div>
              <h3 className="text-xl font-semibold text-[var(--green-dark)] mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To empower travelers and partners with seamless digital tools
                that enhance every stage of the journey.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[var(--green-dark)] mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To become a globally trusted travel platform built on
                authenticity, technology, and human connection.
              </p>
            </div>

          </section>

        </div>
      </main>
    </>
  );
}
