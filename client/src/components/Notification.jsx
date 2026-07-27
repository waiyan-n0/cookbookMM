import {useEffect} from "react";

const Notification = ({ message, type = "success", onClose, duration = 3000 }) => {

    useEffect(() => {
        if (!onClose) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration, message]);

    const config = {
        success: {
            bgColor: "bg-emerald-50 border-emerald-200",
            textColor: "text-emerald-950",
            iconColor: "text-emerald-500",
            barColor: "bg-emerald-500",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        error: {
            bgColor: "bg-rose-50 border-rose-200",
            textColor: "text-rose-950",
            iconColor: "text-rose-500",
            barColor: "bg-rose-500",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        warning: {
            bgColor: "bg-amber-50 border-amber-200",
            textColor: "text-amber-950",
            iconColor: "text-amber-600",
            barColor: "bg-amber-500",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
            ),
        }
    };

    const currentConfig = config[type] || config.success;

    return (
        <div className={`relative flex items-start gap-3 w-80 md:w-96 p-4 rounded-2xl border ${currentConfig.bgColor} shadow-xl backdrop-blur-md transition-all duration-300 transform scale-100`}>
            <div className={`${currentConfig.iconColor} shrink-0 mt-0.5`}>
                {currentConfig.icon}
            </div>

            <div className="flex-1">
                <p className={`text-sm font-medium leading-relaxed ${currentConfig.textColor}`}>
                    {message}
                </p>
            </div>

            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-lg hover:bg-black/5 cursor-pointer shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl overflow-hidden bg-black/5">
                <div className={`h-full ${currentConfig.barColor} animate-[shrink_linear_forwards]`}
                    style={{ animationDuration: `${duration}ms` }}
                />
            </div>
        </div>
    );
};

export default Notification;