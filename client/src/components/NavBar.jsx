import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import defaultPfImage from './../assets/images/defaultProfile.jpg';
import { jwtDecode } from 'jwt-decode';

const NavBar = ({ clickPf, imgUrl }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsAuthenticated(false);
            return;
        }
        try {
            const decoded = jwtDecode(token);
            const currTime = new Date() / 1000;
            if (decoded.exp < currTime) {
                console.log("The token is expired");
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            } else {
                setIsAuthenticated(true);
            }
        } catch (err) {
            console.log(err.message);
            setIsAuthenticated(false);
        }
    }, [location.pathname])
    const loginHandler = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    const handleProfileClick = () => {
        if (location.pathname === '/profile') {
            if (clickPf) clickPf();
        } else {
            navigate('/profile');
        }
    };

    return (
        <section className="sticky top-0 z-40 flex items-center justify-between bg-[#FDF3D7]/90 backdrop-blur-md border-b border-[#f5e3b5] py-4 px-6 md:px-12 transition-all duration-300">

            <div onClick={() => navigate('/')}
                 className="webName curlyFont text-lg md:text-3xl font-medium tracking-wide text-amber-950 cursor-pointer hover:opacity-80 transition-opacity">
                Chef mal
            </div>

            <nav className="">
                <ul className="navItems flex items-center space-x-8 text-xs lg:text-lg md:text-lg font-thin text-amber-900/80">
                    <li onClick={() => navigate('/home')}
                        className="cursor-pointer hover:text-amber-950 transition-colors relative after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-[2px] after:bg-amber-700 hover:after:w-full after:transition-all">Home</li>
                    <li onClick={() => navigate('/recipes')}
                        className="cursor-pointer hover:text-amber-950 transition-colors relative after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-[2px] after:bg-amber-700 hover:after:w-full after:transition-all">Recipes</li>
                    <li onClick={() => navigate('/about')}
                        className="cursor-pointer hover:text-amber-950 transition-colors relative after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-[2px] after:bg-amber-700 hover:after:w-full after:transition-all">About</li>
                </ul>
            </nav>

            <div className="login-box flex items-center">
                {isAuthenticated ? (
                    <div onClick={handleProfileClick}
                         className="w-10 h-10 border-2 border-amber-600/30 rounded-full overflow-hidden cursor-pointer shadow-sm hover:border-amber-700 hover:shadow-md transition-all duration-200 active:scale-95"
                    >
                        <img src={imgUrl ? imgUrl : defaultPfImage} alt="Profile"
                             className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <button onClick={(e) => { loginHandler(e) }}
                            className="px-4 py-2 text-[10px] lg:text-sm font-semibold text-amber-950 border border-amber-900/30 rounded-full hover:bg-amber-950 hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
                    >
                        Login
                    </button>
                )}
            </div>
        </section>
    );
}

export default NavBar;