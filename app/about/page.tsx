export default function About() {
    return (
        <main className="min-h-screen bg-background pb-20 overflow-hidden relative">
            {/* Decorative Background Element */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 pt-24 relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-outfit font-black text-primary mb-6 tracking-tight">
                        About <span className="text-gradient">NextHome</span>
                    </h1>
                    <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
                </div>

                <div className="space-y-12 text-slate-600 leading-relaxed text-lg lg:text-xl font-medium">
                    <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-premium border border-white animate-fade-in-up delay-100">
                        <p className="mb-8">
                            NextHome is a leading real estate platform that
                            revolutionizes the home-buying experience by offering an
                            intuitive interface and advanced search tools. We bridge the gap
                            between standard listings and luxury living, carefully curating
                            properties that define modern elegance.
                        </p>
                        <p>
                            From sleek urban apartments to sprawling luxury estates, our platform
                            provides high-quality imagery and detailed descriptions that offer
                            a comprehensive view of your future home. NextHome ensures you have
                            all the necessary information to make a confident decision.
                        </p>
                    </section>

                    <section className="bg-slate-900 text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl animate-fade-in-up delay-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
                        <h2 className="text-2xl font-outfit font-bold mb-6 text-secondary">Our Perspective</h2>
                        <p className="text-slate-300">
                            NextHome stands out with its personalized service and
                            expert guidance. Our team of experienced real estate
                            professionals is committed to offering tailored advice for
                            buyers, sellers, and investors alike. With access to
                            real-time market data and neighborhood insights, you can
                            confidently navigate the complexities of real estate.
                        </p>
                    </section>

                    <section className="animate-fade-in-up delay-300 text-center px-6">
                        <p className="text-slate-500 italic">
                            "At NextHome, we prioritize your journey. From the initial search
                            to the final handshake, we are your trusted partner in unlocking
                            the door to your future."
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
