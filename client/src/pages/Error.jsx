import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Error = () => {
    const navigate = useNavigate();

    return (
        <section className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-16 text-center">

            <div className="relative mb-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl w-32 h-32 animate-pulse" />

                <div className="relative bg-white border border-slate-100 p-6 rounded-3xl shadow-md text-amber-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A1.75 1.75 0 1 0 19.75 18.5l-5.83-5.83m0 0a6.5 6.5 0 1 0-9.2-9.2 6.5 6.5 0 0 0 9.2 9.2ZM10.5 7.5h.008v.008H10.5V7.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </div>
            </div>

            <div className="max-w-md space-y-3">
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                    Oops! Something went wrong
                </h1>
                <p className="text-base font-semibold text-amber-700 bg-amber-50/60 border border-amber-100 px-4 py-2 rounded-xl inline-block">
                    No page found or Under maintenance
                </p>
                <p className="text-sm text-slate-400 font-medium px-4">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Please try again later.
                </p>
            </div>
            <div className="mt-8 mb-8 flex flex-col sm:flex-row items-center gap-3">
                <button onClick={() => navigate(-1)}
                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                    Go Back
                </button>
                <button onClick={() => navigate('/home')}
                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm shadow-amber-500/10 transition-all cursor-pointer"
                >
                    Back to Home
                </button>
            </div>

            <Footer/>
        </section>
    );
};

export default Error;