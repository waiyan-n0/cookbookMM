import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const banners = [
    {
        id: 1,
        title: "Everyone can be chef",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1600&auto=format&fit=crop",
        link: "/recipes",
        text: "Discover Recipes",
    },
    {
        id: 2,
        title: "Master the Art of Pasta",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1600&auto=format&fit=crop",
        link: "/recipes",
        text: "Discover European Food",
    },
    {
        id: 3,
        title: "Desserts made easy",
        image: "https://images.unsplash.com/photo-1586985289906-406988974504?q=80&w=1600&auto=format&fit=crop",
        link: "/recipes",
        text: "Discover Deserts",
    },
];

const HomeBanner = () => {
    const navigate = useNavigate();

    return (
        <section className="relative w-full h-[80vh] min-h-[400px] max-h-[700px] overflow-hidden">
            <Swiper modules={[Autoplay, Pagination, EffectFade]} effect="fade" spaceBetween={0} slidesPerView={1}
                    autoplay={{ delay: 5000, disableOnInteraction: false }} pagination={{ clickable: true }} loop={true}
                className="w-full h-full"
            >
                {banners.map((slide) => (
                    <SwiperSlide key={slide.id} className="relative w-full h-full">
                        <img src={slide.image} alt="Cooking Banner"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />

                        <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center text-center px-6">
                            <p className="curlyFont text-6xl md:text-8xl lg:text-[100px] text-[#FDF3D7] leading-tight drop-shadow-lg mb-8 animate-fadeInUp">
                                {slide.title}
                            </p>
                            <button
                                onClick={() => navigate(`${slide.link}`)}
                                className="group relative bg-[#fdf3d7] text-amber-950 font-bold px-10 py-4 rounded-full text-lg shadow-2xl hover:bg-white transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                <span className="relative z-10">{slide.text}</span>
                                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 blur-xl"></div>
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <style>{`
                .swiper-pagination-bullet {
                    background: #FDF3D7 !important;
                    opacity: 0.6;
                    width: 12px;
                    height: 12px;
                }
                .swiper-pagination-bullet-active {
                    opacity: 1;
                    background: #FDF3D7 !important;
                    transform: scale(1.2);
                }
                
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
            `}</style>
        </section>
    );
};

export default HomeBanner;