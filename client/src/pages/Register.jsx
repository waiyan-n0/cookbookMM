import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import Notification from "../components/Notification";

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [noti, setNoti] = useState({show:false, msg: "",type: ""});
    const name = username;

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");
        if (!name || !email || !password) {
            setError("Please fill the form input!");
            setNoti({show:true, msg: "Please fill all the input fields!",type: "error"});
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                // alert(data.msg);
                setNoti({show:true, msg: "Registration Failed! Please Try Again.",type: "error"});
                return;
            }
            setNoti({show:true,msg: "Registration Successful! Redirecting to Login Page...",type: "success" });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.log(err.message);
            setError("Server error occurred");
        }
    };

    return (
        <div className="min-h-screen px-4 bg-gradient-to-br from-amber-50/60 to-orange-100/40 flex flex-col justify-between p-4 md:p-8 relative animate-fade-in">
            {noti.show && (
                <div className="fixed top-5 right-5 z-50">
                    <Notification message={noti.msg} type={noti.type} onClose={() => setNoti({ show: false, msg: "", type: "" })}/>
                </div>
            )}
            <div className="max-w-5xl w-full mx-auto mb-6 flex justify-start">
                <button onClick={() => navigate('/home')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-950 bg-white/60 hover:bg-white border border-amber-900/10 rounded-xl transition-all duration-300 active:scale-95 shadow-sm cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Home Page
                </button>
            </div>

            <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] mx-auto mb-12 transform transition-all duration-500 hover:shadow-2xl">
                <div className="hidden md:flex md:w-1/2 relative bg-amber-950 text-white p-12 flex-col justify-between overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop" alt="Cooking background"
                         className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply pointer-events-none transform scale-105 hover:scale-110 transition-transform duration-700"
                    />

                    <div className="relative z-10">
                        <div onClick={() => navigate('/')}
                             className="text-2xl font-bold font-serif text-amber-400 cursor-pointer tracking-wide hover:text-amber-300 transition-colors"
                        >
                            Chef mal
                        </div>
                        <h2 className="text-4xl font-bold mt-16 font-serif leading-tight">Join Our Global Culinary Community</h2>
                    </div>

                    <div className="relative z-10 bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10 transform translate-y-0 hover:-translate-y-1 transition-transform duration-300">
                        <p className="text-sm text-gray-200 italic leading-relaxed">
                            "Create an account to save your favorite recipes, connect with other chefs, and share your own masterpieces."
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white transition-all duration-500">
                    <div className="mb-8">
                        <div onClick={() => navigate('/')} className="md:hidden text-2xl font-bold font-serif text-amber-800 mb-4 cursor-pointer">
                            Chef mal
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 font-serif">Create Account</h3>
                        <p className="text-gray-500 text-sm mt-2">Get started with your free account today.</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-550/10 text-red-700 rounded-xl text-sm font-medium border border-red-200 animate-shake">
                            {error}
                        </div>
                    )}

                    <form className='flex flex-col gap-4' onSubmit={(e) => submitHandler(e)}>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Username</label>
                            <input type='text' placeholder='Your username' required
                                   className='w-full border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-gray-50/50 text-sm transition-all duration-300'
                                   onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Email Address</label>
                            <input type='email' placeholder='example@gmail.com' required
                                   className='w-full border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-gray-50/50 text-sm transition-all duration-300'
                                   onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} placeholder='At least 8 characters' autoComplete="off" required
                                    className='w-full border border-gray-200 pl-4 pr-12 py-3 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-gray-50/50 text-sm transition-all duration-300'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-700 transition-colors cursor-pointer p-1"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button className='w-full bg-amber-500 hover:bg-amber-600 font-bold py-3.5 rounded-xl text-amber-950 cursor-pointer transition-all duration-300 active:scale-[0.98] shadow-lg shadow-amber-500/10 mt-4 text-sm transform hover:-translate-y-0.5'>
                            Register
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login"
                              className="text-amber-700 hover:text-amber-900 font-semibold underline transition-colors duration-300"
                        >
                            Sign In here
                        </Link>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Register;