import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const posts = [
    {
        title: "The Future of Sustainable Travel",
        excerpt:
            "How innovation and responsible tourism are shaping the next generation of global exploration.",
        date: "January 2026",
        category: "Insights",
    },
    {
        title: "Building Meaningful Travel Experiences",
        excerpt:
            "Creating journeys that connect culture, community, and technology seamlessly.",
        date: "December 2025",
        category: "Experience",
    },
    {
        title: "Innovation in Modern Travel Planning",
        excerpt:
            "Exploring digital transformation and how smart systems improve travel decisions.",
        date: "November 2025",
        category: "Technology",
    },
];

export default function BlogPage() {
    return (
        <>

            {/* Header Spacer */}
            <div className="h-24 md:h-28" />

            <main className="bg-gray-50 pt-24">

                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 space-y-32 font-sans">

                    {/* Hero Section */}
                    <section className="text-center max-w-3xl mx-auto space-y-6">
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--green-dark)]">
                            Govista Insights
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Perspectives, research, and ideas shaping the future of global travel.
                        </p>
                    </section>

                    {/* Blog List */}
                    <section className="space-y-12">
                        {posts.map((post, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-2xl p-8 transition hover:shadow-md"
                            >
                                <div className="space-y-4">

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span className="text-[var(--green-primary)] font-medium">
                                            {post.category}
                                        </span>
                                        <span>{post.date}</span>
                                    </div>

                                    <h2 className="text-2xl font-semibold text-[var(--green-dark)]">
                                        {post.title}
                                    </h2>

                                    <p className="text-gray-600 leading-relaxed">
                                        {post.excerpt}
                                    </p>

                                    <button className="mt-4 text-sm font-medium text-[var(--green-primary)] hover:text-[var(--green-dark)] transition">
                                        Read More →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Empty State Section */}
                    <section className="text-center pt-16 border-t border-gray-200">
                        <h3 className="text-xl font-semibold text-[var(--green-dark)] mb-3">
                            More Articles Coming Soon
                        </h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We’re currently preparing thoughtful insights and industry perspectives.
                            Stay tuned for updates from the Govista team.
                        </p>
                    </section>

                </div>
            </main>

        </>
    );
}
