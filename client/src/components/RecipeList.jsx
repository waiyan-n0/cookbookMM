import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import CreateRecipe from "./CreateRecipe.jsx";

const RecipeList = ({ type, id }) => {
    const navigate = useNavigate();
    const [recipesList, setRecipesList] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    // console.log('pass id:',id);
    useEffect(() => {
        if(!id) return;
        fetch(`http://localhost:3000/recipes/${id}/recipes_list`)
            .then((response) => response.json())
            .then((data) => {
                //console.log('My Recipes List: ',data.result);
                setRecipesList(data.result);
            })
            .catch(error => console.log('Error Fetching Your Recipes List:',error));
    }, [id]);
    //console.log('recipe list in line 18,RecipeList.jsx: ',recipesList);
    if (recipesList.length === 0) {
        return (
            <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 bg-slate-50/50">
                You haven't created any recipes yet!
            </div>
        );
    }

    const editRecipe = (e,id) =>{
        e.stopPropagation();
        console.log('(edit)pass id:',id);
        console.log('edit recipes : ',recipesList);

        const selectedRecipeID = recipesList.find((recipe) => recipe._id === id);
        if(selectedRecipeID){
            setSelectedRecipe(selectedRecipeID);
            setIsUpdateModalOpen(true);
        }
        console.log(isUpdateModalOpen);
    };
    //console.log('for auther : ',selectedRecipe);
    const deleteRecipe = async(e,id) => {
        e.stopPropagation();
        console.log('(delete)pass id:',id);
        try{
            const response = await fetch(`http://localhost:3000/recipes/${id}`,{
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id}),
            });
            const deletedRecipe = await response.json();
            if(!response.ok){
                alert(deletedRecipe.msg);
                return new Error('Failed to delete recipe');
            }else {
                alert(deletedRecipe.msg);
                window.location.reload();
            }
        }catch(err){
            console.log('Error Deleting Recipe!',err);
            alert("Error Deleting Recipe!");
        }
    }

    return(
        <section className='flex flex-col w-full'>
            <div className='flex flex-row flex-wrap gap-6 p-4'>
                {recipesList.map((recipe) => (
                    <div key={recipe._id} onClick={()=>navigate(`/recipes/${recipe._id}`) }
                         className="w-full max-w-xs overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                            <button onClick={(e)=>editRecipe(e,recipe._id)} className='absolute flex items-center justify-center right-2 top-2 text-black cursor-pointer bg-white rounded-md'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                </svg>
                            </button>
                            <button onClick={(e)=>deleteRecipe(e,recipe._id)}
                                className='absolute flex items-center justify-center right-8 top-2 text-red-500 cursor-pointer rounded-md hover:scale-125'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                                    className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                </svg>
                            </button>
                            <img src={recipe.image} alt={recipe.recipe_name}
                                 className="h-full w-full object-cover transition-transform duration-500"
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
                                <div
                                    className="flex items-center gap-1 text-xs font-medium text-gray-500 shrink-0 bg-gray-50 px-2 py-1 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2}
                                         stroke="currentColor" className="w-3.5 h-3.5 text-amber-500">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
                                    <span>{recipe.cookingTime} mins</span>
                                </div>
                            </div>

                            <hr className="border-gray-100 my-2"/>

                            <div className="flex items-center justify-around text-sm text-gray-600 pt-1">
                                <button onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1.5 hover:text-red-500 transition-colors py-1 px-2 rounded-md hover:bg-gray-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                                    </svg>
                                    <span className="text-xs font-medium">Like</span>
                                </button>
                                <span className="text-gray-300" aria-hidden="true">|</span>
                                <button onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1.5 hover:text-blue-500 transition-colors py-1 px-2 rounded-md hover:bg-gray-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48L4.32 19.8c-.11.353.17.65.514.543l2.582-.805c1.333.456 2.793.712 4.284.712Z"/>
                                    </svg>
                                    <span className="text-xs font-medium">Comment</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <CreateRecipe key={selectedRecipe?._id || "createRecipe"} isOpen={isUpdateModalOpen} onClose={() => {
                setIsUpdateModalOpen(false);
                setSelectedRecipe(null);
            }} selectedRecipe={selectedRecipe} author={{ _id: selectedRecipe?.author.id, name: selectedRecipe?.author.name }} />
        </section>
    );
}

export default RecipeList;