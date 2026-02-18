import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { FiHome, FiHeart, FiGift, FiBookOpen, FiSmile, FiClock, FiActivity, FiAirplay } from "react-icons/fi";

const perks = [
    {
        icon: <FiHome className="text-[var(--green-primary)] w-9 h-9" />,
        title: "Remote-first",
        description: "Govista takes a remote-friendly approach to collaborate across a worldwide team."
    },
    {
        icon: <FiHeart className="text-[var(--green-primary)] w-9 h-9" />,
        title: "Employee assistance program",
        description: "We’re here for you with resources and programs to help you through life’s challenges."
    },
    {
        icon: <FiGift className="text-[var(--green-primary)] w-9 h-9" />,
        title: "Donation matching",
        description: "We match qualifying charitable donations annually to multiply your impact."
    },
    {
        icon: <FiBookOpen className="text-[var(--green-primary)] w-9 h-9" />,
        title: "Tuition assistance",
        description: "Receive annual support for professional development and accredited programs."
    },
    {
        icon: <FiSmile className="text-[var(--green-primary)] w-9 h-9" />,
        title: "Lifestyle benefit",
        description: "An annual benefit to invest in wellness, travel, or what matters most to you."
    },
    {
        icon: <FiClock className="text-[var(--green-primary)] w-9 h-9" />,
        title: "Flexible schedule",
        description: "Trust and accountability enable true work-life balance by design."
    },
    {
        icon: <FiActivity className="text-[var(--green-primary)] w-9 h-9" />,
        title: "Health benefits",
        description: "Comprehensive coverage and competitive premiums tailored by country."
    },
    {
        icon: <FiAirplay className="text-[var(--green-primary)] w-9 h-9" />,
        title: "Travel perks",
        description: "Exclusive travel discounts because exploration is part of growth."
    },
];

export default function CareersPage() {
    return (
        <>

            <main className="bg-gray-50 pt-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 space-y-32 font-sans">

                    {/* Hero Section */}
                    <section className="text-center max-w-3xl mx-auto space-y-6">
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--green-dark)]">
                            Careers at Govista
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Join a team dedicated to redefining global travel experiences.
                            At Govista, we foster innovation, ownership, and meaningful impact —
                            empowering you to grow while shaping the future of exploration.
                        </p>
                    </section>

                    {/* Perks Section */}
                    <section className="space-y-14">
                        <div className="text-center space-y-3">
                            <h2 className="text-3xl font-semibold text-[var(--green-dark)]">
                                Life at Govista
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                We believe great work begins with a supportive environment and meaningful benefits.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {perks.map((perk, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300"
                                >
                                    <div className="flex justify-center mb-5">
                                        {perk.icon}
                                    </div>

                                    <h3 className="text-lg font-semibold text-[var(--green-dark)] mb-3">
                                        {perk.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {perk.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="text-center bg-white rounded-3xl border border-gray-200 shadow-sm py-16 px-8 space-y-6">
                        <h2 className="text-2xl md:text-3xl font-semibold text-[var(--green-dark)]">
                            Ready to build the future of travel?
                        </h2>

                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Explore our current openings and take the next step in your journey with Govista.
                        </p>

                        <div className="pt-2">
                            <button className="inline-flex items-center justify-center bg-[var(--green-primary)] text-white px-8 py-3 text-sm font-medium rounded-lg shadow-sm hover:bg-[var(--green-dark)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--green-primary)] focus:ring-offset-2">
                                Browse Open Positions
                            </button>
                        </div>
                    </section>

                </div>
            </main>

        </>
    );
}
