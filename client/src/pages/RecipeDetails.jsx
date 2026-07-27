import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Comment from "../pages/Comment";

const RecipeDetails = () => {
    const [detail, setDetail] = useState(null);
    const { _id } = useParams();
    useEffect(() => {
        fetch(`http://localhost:3000/recipes/${_id}`)
            .then(res => res.json())
            .then(data => setDetail(data.result))
            .catch(err => console.error('Error fetching data: ', err));
    }, [_id]);
    // console.log('what inside: ',detail);
    if (!detail) {
        return (
            <div className="flex h-64 items-center justify-center text-lg font-medium text-gray-500 animate-pulse">
                Loading delicious recipe details...
            </div>
        );
    }
    const { recipe_name, author, image, prepTime, cookingTime, serving, ingredients, difficulty, instructions, createAt } = detail;

    return (
        <section className="space-y-8 bg-white text-gray-800">
            <NavBar/>
            <div className="px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                <div className="space-y-2">
                    <div className="flex items-center justify-between space-y-3">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">{recipe_name}</h1>
                        <div className='flex flex-col items-end'>
                            <div className="flex items-center justify-center gap-2.5 mb-2">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 border border-amber-200 text-amber-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                                    </svg>
                                </div>
                                <p className="text-xs font-medium text-slate-400">
                                    <span className="text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors cursor-pointer">{author?.name || "Anonymous Author"}</span>
                                </p>
                            </div>
                            <div className="text-xs font-medium text-slate-500 sm:text-right bg-white sm:bg-transparent px-2.5 sm:p-0 rounded-md border border-slate-100 sm:border-none shadow-sm sm:shadow-none">
                                {new Date(createAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-2xl shadow-md border border-gray-100 aspect-video mt-2">
                        <img src={image} alt={recipe_name}
                             className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
                    </div>

                    <div className="grid lg:grid-cols-4 grid-cols-2 gap-2 py-3 px-4 bg-gray-50 rounded-xl text-center text-sm font-medium text-gray-600">
                        <div className="border-r border-gray-200">
                            <span className="block text-xs text-gray-400 uppercase font-bold">Preparation Time</span>
                            {prepTime} mins
                        </div>
                        <div className="border-r border-gray-200">
                            <span className="block text-xs text-gray-400 uppercase font-bold">Cooking Time</span>
                            {cookingTime} mins
                        </div>
                        <div>
                            <span className="block text-xs text-gray-400 uppercase font-bold">Servings</span>
                            {serving}
                        </div>
                        <div>
                            <span className="block text-xs text-gray-400 uppercase font-bold">Level</span>
                            {difficulty}
                        </div>
                    </div>
                </div>

                <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-2xl h-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-orange-200/60">Ingredients</h3>
                    <ul className="space-y-3">
                        {ingredients?.map((item, idx) => (
                            <li key={item._id || idx} className="flex justify-between items-center py-1 border-b border-dashed border-gray-200 last:border-none text-gray-700">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-sm bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full font-semibold">
                                    {item.amount} {item.unit}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="bg-gray-50/50 border border-gray-200 p-6 md:p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Instructions</h3>
                <ol className="space-y-4 list-decimal list-inside text-gray-700 marker:text-orange-500 marker:font-bold">
                    {instructions?.map((step, idx) => (
                        <li key={idx} className="pl-2 leading-relaxed inline-block w-full">
                            <span className="font-semibold text-gray-900 mr-2">{idx + 1}.</span> {step}
                        </li>
                    ))}
                </ol>
            </div>

            {detail && detail._id ? (
                <Comment recipeId={detail._id} />
            ) : (
                <div className="text-center text-sm text-gray-400">Loading comments...</div>
            )}
            <div>
                <h1 className='font-bold text-3xl px-8 '>Related Recipes🧑🏼‍🍳</h1>
                <RecipeCard type={`${detail.category}`}/>
            </div>
            <Footer/>
        </section>
    );
};

export default RecipeDetails;