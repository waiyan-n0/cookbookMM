import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import Notification from "../components/Notification";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [noti, setNoti] = useState({ show: false, msg: "", type: "" });
    const name = username;

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                setNoti({ show: true, msg: data.msg || "Login Failed! Please Try Again.", type: "error" });
                return;
            }
            if (response.ok && data.result?.token) {
                localStorage.setItem('token', data.result.token);
                window.dispatchEvent(new Event('local-storage-update'));
                setNoti({ show: true, msg: "Login Successful!", type: "success" });
                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            } else {
                console.log(data.msg);
                setNoti({ show: true, msg: data.msg || "Login failed", type: "error" });
            }
        } catch (error) {
            console.error("Error during login:", error);
            setNoti({ show: true, msg: "Something went wrong. Please try again.", type: "error" });
        }
    };

    return (
        <div className="w-full px-4 min-h-screen bg-gradient-to-br from-amber-50/60 to-orange-100/40 flex flex-col justify-between relative">
            {noti.show && (
                <div className="fixed top-5 right-5 z-50">
                    <Notification message={noti.msg} type={noti.type}
                        onClose={() => setNoti({ show: false, msg: "", type: "" })}
                    />
                </div>
            )}
            <div className="max-w-5xl w-full mx-auto mb-6 flex justify-start mt-8">
                <button onClick={() => navigate('/home')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-950 bg-white/60 hover:bg-white border border-amber-900/10 rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Home Page
                </button>
            </div>

            <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] mx-auto mb-12">
                <div className="hidden md:flex md:w-1/2 relative bg-amber-950 text-white p-12 flex-col justify-between overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop" alt="Delicious food"
                         className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply pointer-events-none"
                    />

                    <div className="relative z-10">
                        <div onClick={() => navigate('/')}
                             className="text-2xl font-bold font-serif text-amber-400 cursor-pointer tracking-wide"
                        >
                            Chef mal
                        </div>
                        <h2 className="text-4xl font-bold mt-16 font-serif leading-tight">Discover the Art of Homemade Cooking</h2>
                    </div>

                    <div className="relative z-10 bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                        <p className="text-sm text-gray-200 italic leading-relaxed">
                            "Good food brings people together. Join our community of food lovers today and share your recipes."
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
                    <div className="mb-8">
                        <div onClick={() => navigate('/')} className="md:hidden text-2xl font-bold font-serif text-amber-800 mb-4 cursor-pointer">
                            Chef mal
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 font-serif">Welcome Back</h3>
                        <p className="text-gray-500 text-sm mt-2">Please enter your details to sign in to your account.</p>
                    </div>

                    <form className='flex flex-col gap-4' onSubmit={(e) => loginHandler(e)}>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Username</label>
                            <input type='text' placeholder='Your username' required
                                   className='w-full border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm bg-gray-50/50'
                                   onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Email Address</label>
                            <input className='w-full border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm bg-gray-50/50'
                                   type='email' placeholder='example@gmail.com' required
                                   onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Password</label>
                            <div className='relative'>
                                <input className='w-full border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm bg-gray-50/50'
                                    type={showPassword ? 'text' : 'password'} placeholder='Enter your password...' required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-700 transition-colors cursor-pointer p-1"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            className='w-full bg-amber-500 hover:bg-amber-600 font-bold py-3.5 rounded-xl text-amber-950 cursor-pointer transition-all active:scale-[0.98] shadow-lg shadow-amber-500/10 mt-4 text-sm'>
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register"
                              className="text-amber-700 hover:text-amber-900 font-semibold underline transition-colors"
                        >
                            Register here
                        </Link>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Login;