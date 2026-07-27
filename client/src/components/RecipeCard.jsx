import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import Footer from "./Footer.jsx";
import Notification from "./Notification.jsx";

const RecipeCard = ({ type }) => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noti, setNoti] = useState({ show: false, msg: "", type: "" });
    const token = localStorage.getItem("token");

    const sliderRef = useRef(null);
    const isAllType = type === "all";

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3000/recipes/types/${type}`)
            .then((response) => response.json())
            .then(data => {
                const fetchedRecipes = data.result || [];
                setRecipes(fetchedRecipes);
                setLoading(false);

                if (token && fetchedRecipes.length > 0) {
                    fetchedRecipes.forEach(recipe => {
                        fetch(`http://localhost:3000/interactions/${recipe._id}/like-status`, {
                            headers: { "Authorization": `Bearer ${token}` }
                        })
                            .then(res => res.json())
                            .then(statusData => {
                                if (statusData.con) {
                                    setRecipes(prev => prev.map(r =>
                                        r._id === recipe._id ? { ...r, isLiked: statusData.result.isLiked } : r
                                    ));
                                }
                            })
                            .catch(err => console.error("Error fetching like status:", err));
                    });
                }
            })
            .catch(error => {
                console.error('Error Fetching Data: ', error);
                setNoti({ show: true, msg: 'Error Fetching Data!', type: 'error' });
                setLoading(false);
            });
    }, [type, token]);

    const slide = (direction) => {
        if (sliderRef.current) {
            const { scrollLeft, clientWidth } = sliderRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
            sliderRef.current.scrollTo({
                left: scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const like = async (e, recipeId, isLiked) => {
        e.stopPropagation();
        if (!token) {
            setNoti({ show: true, msg: "You need to login to like this post!", type: 'error' });
            return;
        }
        setRecipes(prevRecipes => prevRecipes.map(recipe => {
            if (recipe._id === recipeId) {
                const currentLikes = recipe.likes || 0;
                return {
                    ...recipe,
                    isLiked: !isLiked,
                    likes: isLiked ? currentLikes - 1 : currentLikes + 1,
                };
            }
            return recipe;
        }));

        try {
            const response = await fetch("http://localhost:3000/interactions/like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ recipe_id: recipeId })
            });

            const data = await response.json();
            if (!response.ok) return new Error("API Error");

            if (data.con) {
                setRecipes(prevRecipes => prevRecipes.map(recipe =>
                    recipe._id === recipeId ? { ...recipe, isLiked: data.result.isLiked, likes: data.result.likes_count } : recipe
                ));
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            setNoti({ show: true, msg: 'Error giving like!', type: 'error' });
            setRecipes(prevRecipes => prevRecipes.map(recipe => {
                if (recipe._id === recipeId) {
                    const currentLikes = recipe.likes || 0;
                    return {
                        ...recipe,
                        isLiked: isLiked,
                        likes: isLiked ? currentLikes + 1 : currentLikes - 1
                    };
                }
                return recipe;
            }));
        }
    };

    const goDetail = async (recipe) => {
        if (!token) {
            setNoti({ show: true, msg: 'You need to login to see the recipe\'s details and instructions! ', type: 'error' });
            return;
        }
        navigate(`/recipes/${recipe._id}`);
    };

    if (loading) {
        return (
            <div className="flex h-48 items-center justify-center text-gray-400 animate-pulse">
                Loading {type} recipes...
            </div>
        );
    }

    return (
        <section className='w-full mx-auto relative'>
            {isAllType && <NavBar />}
            {noti.show && (
                <div className="fixed top-5 right-5 z-50">
                    <Notification message={noti.msg} type={noti.type} onClose={() => setNoti({ show: false, msg: "", type: "" })} />
                </div>
            )}

            <h1 className='font-bold text-2xl px-8 py-2 underline capitalize'>{type}</h1>

            {recipes.length === 0 ? (
                <div className="flex flex-col w-full items-center justify-center bg-amber-50/40 border border-dashed border-amber-200 rounded-2xl mx-auto text-center p-8 my-4">
                    <div className="p-3 bg-amber-100/60 rounded-full text-amber-600 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-amber-900 mb-1">No Related Recipes Found!</h3>
                    <p className="text-sm text-amber-700/80 max-w-sm">
                        We couldn't find any recipes under the <span className="font-semibold text-amber-900">"{type}"</span> category right now. Stay tuned or try creating one yourself now!
                    </p>
                </div>
            ) : (
                <div className="relative group px-8 py-4">
                    {!isAllType && recipes.length > 4 && (
                        <>
                            <button onClick={() => slide('left')}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-gray-100 text-gray-700 hover:bg-amber-500 hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer" title="Previous"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                            </button>

                            <button onClick={() => slide('right')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-gray-100 text-gray-700 hover:bg-amber-500 hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer" title="Next"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </>
                    )}
                    <div ref={sliderRef} style={!isAllType ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}
                        className={ isAllType ? "flex flex-row flex-wrap gap-6 justify-start" : "flex overflow-x-auto gap-6 scroll-smooth snap-x snap-mandatory no-scrollbar pb-2"}
                    >
                        {recipes.map((recipe) => (
                            <div key={recipe._id} onClick={() => goDetail(recipe)}
                                className={`overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer ${
                                    isAllType ? "w-full max-w-xs" : "w-full min-w-[260px] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)] shrink-0 snap-start"
                                }`}
                            >
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                    <img src={recipe.image} alt={recipe.recipe_name}
                                         className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                         onError={(e) => {
                                             e.target.src = 'https://placehold.co/600x400?text=Recipe+Image';
                                         }}
                                    />
                                </div>

                                <div className="p-4">
                                    <div className="mb-3 flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-gray-800 text-base line-clamp-1">
                                            {recipe.recipe_name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-xs font-medium text-gray-500 shrink-0 bg-gray-50 px-2 py-1 rounded-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-amber-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                            </svg>
                                            <span>{recipe.cookingTime} mins</span>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100 my-2"/>

                                    <div className="flex items-center justify-around text-sm text-gray-600 pt-1">
                                        <button onClick={(e) => like(e, recipe._id, recipe.isLiked)}
                                                className={`flex items-center gap-1.5 transition-colors py-1 px-2 rounded-md hover:bg-gray-50 ${
                                                    recipe.isLiked ? 'text-red-500 font-semibold' : 'text-gray-600 hover:text-red-500'
                                                }`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill={recipe.isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                                            </svg>
                                            <span className="text-xs font-medium">
                                                {Array.isArray(recipe.likes) ? recipe.likes.length : (recipe.likes || 0)}{" "}
                                                {(Array.isArray(recipe.likes) ? recipe.likes.length : (recipe.likes || 0)) === 1 ? 'like' : 'likes'}
                                            </span>
                                        </button>

                                        <span className="text-gray-300" aria-hidden="true">|</span>

                                        <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors py-1 px-2 rounded-md hover:bg-gray-50">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48L4.32 19.8c-.11.353.17.65.514.543l2.582-.805c1.333.456 2.793.712 4.284.712Z"/>
                                            </svg>
                                            <span className="text-xs font-medium">
                                                {recipe.commentsCount || 0} {(recipe.commentsCount || 0) === 1 ? 'comment' : 'comments'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {isAllType && <Footer />}
        </section>
    );
};

export default RecipeCard;