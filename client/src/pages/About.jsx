import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <NavBar />

            {/* Main Content */}
            <main className="flex-grow max-w-5xl mx-auto px-6 py-16 w-full">

                {/* 1. Hero Section */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-orange-500 font-bold text-xs uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full">
                        Our Story
                    </span>
                    <h1 className="text-4xl font-black text-gray-900 mt-3 mb-6 tracking-tight">
                        Bringing the Joy of <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Cooking</span> to Your Kitchen
                    </h1>
                    <p className="text-gray-600 leading-relaxed text-base">
                        FoodyRecipe started with a simple idea: making cooking accessible, fun, and delicious for everyone. Whether you are a master chef or just learning to boil an egg, we are here to inspire your culinary journey.
                    </p>
                </div>

                {/* 2. Grid Section: Image & Mission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100 bg-gray-100">
                        <img
                            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
                            alt="Cooking together"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col gap-6">
                        <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            We believe that good food has the power to bring people together. Our mission is to provide clear, foolproof, and mouth-watering recipes that eliminate the guesswork from cooking.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Every recipe shared on our platform is carefully crafted, tested, and loved by our community. From quick 15-minute weeknight dinners to elaborate weekend feasts, we cover it all.
                        </p>
                    </div>
                </div>

                {/* 3. Fun Facts / Achievements Counter */}
                <div className="bg-white border border-gray-100 rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-sm mb-20">
                    <div>
                        <p className="text-3xl font-black text-orange-500">1,000+</p>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">Tested Recipes</p>
                    </div>
                    <div>
                        <p className="text-3xl font-black text-amber-500">50k+</p>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">Happy Cooks</p>
                    </div>
                    <div>
                        <p className="text-3xl font-black text-orange-500">15 mins</p>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">Average Cook Time</p>
                    </div>
                    <div>
                        <p className="text-3xl font-black text-amber-500">100%</p>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">Deliciousness</p>
                    </div>
                </div>

                {/* 4. Call To Action (CTA) Section */}
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-10 text-center text-white shadow-xl shadow-orange-100 max-w-3xl mx-auto">
                    <h3 className="text-2xl font-extrabold mb-3">Ready to Start Cooking?</h3>
                    <p className="text-orange-50/90 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                        Explore our curated collection of trending recipes and find your next favorite meal today.
                    </p>
                    <button
                        onClick={() => navigate("/recipes/all")}
                        className="bg-white text-orange-600 font-bold text-sm px-6 py-3 rounded-xl transition-all hover:bg-orange-50 active:scale-95 shadow-md"
                    >
                        Browse All Recipes
                    </button>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default About;