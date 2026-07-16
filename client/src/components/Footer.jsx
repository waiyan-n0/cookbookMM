import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const handleSubscribe = (e) => {
        e.preventDefault();
        alert("Thank you for subscribing to our newsletter! 🍳");
    };

    return (
        <footer className="bg-white border-t border-gray-100 text-gray-600">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                            <span className="curlyFont text-5xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                Chef mal
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Discover the joy of cooking with simple, delicious, and easy-to-follow recipes crafted by food lovers around the world.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-gray-800 font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
                        <ul className="flex flex-col gap-2.5 text-sm font-medium">
                            <li><button onClick={() => navigate("/")} className="hover:text-orange-500 transition-colors">Home</button></li>
                            <li><button onClick={() => navigate("/recipes")} className="hover:text-orange-500 transition-colors">All Recipes</button></li>
                            <li><button onClick={() => navigate("/about")} className="hover:text-orange-500 transition-colors">About Us</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-gray-800 font-bold text-sm uppercase tracking-wider mb-4">Categories</h4>
                        <ul className="flex flex-col gap-2.5 text-sm font-medium">
                            <li><button onClick={() => navigate("/recipes/european_food")} className="hover:text-orange-500 transition-colors">🔥 Popular</button></li>
                            <li><button onClick={() => navigate("/recipes/all?filter=most-loved")} className="hover:text-orange-500 transition-colors">💖 Most Loved</button></li>
                            <li><button onClick={() => navigate("/recipes/all?filter=latest")} className="hover:text-orange-500 transition-colors">⏰ Latest Updates</button></li>
                            <li><span className="text-gray-400 cursor-not-allowed">🥗 Healthy Foods</span></li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h4 className="text-gray-800 font-bold text-sm uppercase tracking-wider mb-1">Join Our Newsletter</h4>
                        <p className="text-xs text-gray-500">Get fresh recipes delivered straight to your inbox weekly.</p>
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 mt-1">
                            <input type="email" placeholder="Your email address" required
                                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                            />
                            <button type="submit"
                                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors shadow-sm shadow-orange-200"
                            >
                                Join
                            </button>
                        </form>
                    </div>

                </div>

                <hr className="border-gray-100 my-6" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-medium">
                    <p>© {currentYear} Chef mal. Built with ❤️ for food lovers.</p>

                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-blue-600 transition-colors p-1.5 hover:bg-gray-50 rounded-lg">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                            </svg>
                        </a>
                        <a href="#" className="hover:text-pink-600 transition-colors p-1.5 hover:bg-gray-50 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        <a href="#" className="hover:text-red-600 transition-colors p-1.5 hover:bg-gray-50 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                            </svg>
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;