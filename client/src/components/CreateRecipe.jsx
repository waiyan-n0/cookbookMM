import { useState } from "react";
import { supabase } from "./../config/supabaseClient.js";
import Notification from "./Notification.jsx";

const CreateRecipe = ({ isOpen, onClose, author,  selectedRecipe }) => {
    const [recipeName, setRecipeName] = useState(selectedRecipe?.recipe_name || "");

    const cat = selectedRecipe?.category?.[0] || "";
    const categoriesOptions = ["Soup", "Main Dishes", "Snacks", "Drinks"];
    const isCustom = cat && !categoriesOptions.includes(cat);
    const [category, setCategory] = useState(isCustom ? "Other" : cat);
    const [customCategory, setCustomCategory] = useState(isCustom ? cat : "");

    const [difficulty, setDifficulty] = useState(selectedRecipe?.difficulty?.[0] || "Easy");
    const [serving, setServing] = useState(selectedRecipe?.serving?.[0] || "1");
    const [prepTime, setPrepTime] = useState(selectedRecipe?.prepTime || "10");
    const [cookingTime, setCookingTime] = useState(selectedRecipe?.cookingTime || "20");
    const [ingredients, setIngredients] = useState(selectedRecipe?.ingredients || []);
    const [instructions, setInstructions] = useState(selectedRecipe?.instructions || []);
    const [imgUrl, setImgUrl] = useState(selectedRecipe?.image || "");
    const [imageFile, setImageFile] = useState(null);
    const [noti, setNoti] = useState({show:false, msg:"",type:""});
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const addIngredient = () => setIngredients([...ingredients, { name: "", amount: "", unit: "cups" }]);
    const removeIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));
    const addInstruction = () => setInstructions([...instructions, ""]);
    const removeInstruction = (index) => setInstructions(instructions.filter((_, i) => i !== index));

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            setImageFile(file);
            setImgUrl(URL.createObjectURL(file));
        } else {
            setNoti({show:true, msg:'File is too large! Maximum limit is 5MB.',type: "error"});
        }
    };
    const createRecipeHandler = async (e) => {
        e.preventDefault();

        if(loading) return;

        if (!imageFile && !imgUrl) {
            // alert('Please upload an image for your recipe!');
            setNoti({show:true, msg:"Please Upload an image for your recipe!",type:"error"});
            return;
        }
        setLoading(true);
        if (category === "Other" && !customCategory.trim()) {
            setNoti({ show: true, msg: "Please enter your custom category name!", type: "error" });
            return;
        }
        try {
            let publicUrl = imgUrl;
            //if new image, upload to supabase
            if (imageFile) {
                const fileExtension = imageFile.name.split(".").pop();
                const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExtension}`;
                const filePath = `store_recipes/${uniqueFileName}`;
                const { data: uploadData, err: uploadError } = await supabase.storage.from('recipe_imgs').upload(filePath, imageFile);
                console.log(uploadData);
                if (uploadError) {
                    console.log(uploadError);
                    setLoading(false);
                    setNoti({show:true, msg:"Image Uploading Error!",type:"error"});
                    return new Error('Image uploading Error!');
                }

                const { data: { publicUrl: newUrl } } = supabase.storage.from('recipe_imgs').getPublicUrl(filePath);
                publicUrl = newUrl;
            }

            const payload = {
                author: {
                    id: author?._id,
                    name: author?.name || "anonymous",
                },
                recipe_name: recipeName,
                image: publicUrl,
                category: [category === "Other" ? customCategory : category],
                difficulty: [difficulty],
                serving: Number(serving),
                prepTime: Number(prepTime),
                cookingTime: Number(cookingTime),
                ingredients,
                instructions,
            };

            const isUpdate = !!selectedRecipe;
            const apiUrl = isUpdate ? `http://localhost:3000/recipes/${selectedRecipe._id}` : 'http://localhost:3000/recipes';
            const apiMethod = isUpdate ? 'PUT' : 'POST';

            //console.log(`${apiMethod} Payload: `, payload);

            const response = await fetch(apiUrl, {
                method: apiMethod,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const recipesData = await response.json();
            if (!response.ok) {
                //alert(recipesData.msg);
                setLoading(false);
                setNoti({show:true, msg:`${recipesData.msg}`,type:"error"});
                return new Error(`Fail to ${apiMethod} Recipe`);
            } else {
                setNoti({show:true, msg:`${recipesData.msg || 'Recipe saved successfully!'}`, type:"success"});
                setTimeout(() => {
                    setLoading(false); onClose();
                    window.location.reload();
                }, 1500);
            }
        } catch (err) {
            console.log(err.message);
            setLoading(false);
            setNoti({show:true, msg:"An unexpected error occurred in our system. Sorry!",type:"error"});
        }
    };
    //console.log('loading: ',loading);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs overflow-y-auto">
            {noti.show && (
                <div className="fixed top-5 right-5 z-50">
                    <Notification message={noti.msg} type={noti.type} onClose={() => setNoti({ show: false, msg: "", type: "" })}/>
                </div>
            )}
            <div onClick={onClose} className="fixed inset-0 -z-10" />
            <form onSubmit={createRecipeHandler} className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-5 bg-slate-900 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h1 className="text-lg font-bold">Create New Recipe</h1>
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-xl p-1 font-bold transition-colors">
                        &times;
                    </button>
                </div>

                <div className="p-6 md:p-8 space-y-8 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Recipe Name</label>
                            <input type="text" onChange={(e) => setRecipeName(e.target.value)} value={recipeName} required placeholder='E.g. Chicken Curry'
                                   className="mt-1.5 block w-full rounded-lg border-slate-200 py-2.5 px-3 text-sm focus:border-amber-500 focus:ring-amber-500 border"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Category</label>
                            <select name={category === "Other" ? "ignore_category" : "category"} required
                                    value={category} onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1.5 block w-full rounded-lg border-slate-200 py-2.5 px-3 text-sm focus:border-amber-500 focus:ring-amber-500 border bg-white"
                            >
                                <option value="" disabled>Choose Category</option>
                                <option value="Soup">Soup</option>
                                <option value="Main Dishes">Main Dishes</option>
                                <option value="Snacks">Snacks</option>
                                <option value="Drinks">Drinks</option>
                                <option value="Other">Other (Custom Category)</option>
                            </select>

                            {category === "Other" && (
                                <input type="text" name="category" placeholder="Enter custom category name..." value={customCategory}
                                       onChange={(e) => setCustomCategory(e.target.value)}
                                       className="mt-2 block w-full rounded-lg border-amber-400 py-2 px-3 text-sm focus:border-amber-500 focus:ring-amber-500 border"
                                />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Difficulty</label>
                            <select onChange={(e) => setDifficulty(e.target.value)} name="difficulty"
                                    className="mt-1.5 block w-full rounded-lg border-slate-200 py-2.5 px-3 text-sm focus:border-amber-500 focus:ring-amber-500 border bg-white"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Serving</label>
                            <div className="relative mt-1.5 flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
                                <button type="button" onClick={() => setServing(prev => Math.max(0, Number(prev || 0) - 1))}
                                        className="px-3 py-2.5 text-slate-500 hover:bg-slate-50 font-bold transition-colors border-r border-slate-100"
                                >—
                                </button>
                                <input type="number" name="prepTime" value={serving}
                                       onChange={(e) => setServing(Math.max(0, parseInt(e.target.value) || 0))}
                                       className="block w-full border-0 py-2.5 pl-3 pr-12 text-sm text-center focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="absolute right-12 text-xs font-medium text-slate-400 pointer-events-none">Servings</span>
                                <button type="button" onClick={() => setServing(prev => Number(prev || 0) + 1)}
                                        className="px-3 py-2.5 text-slate-500 hover:bg-slate-50 font-bold transition-colors border-l border-slate-100"
                                >+
                                </button>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Preparation Time</label>
                            <div className="relative mt-1.5 flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
                                <button type="button"
                                        onClick={() => setPrepTime(prev => Math.max(0, Number(prev || 0) - 5))}
                                        className="px-3 py-2.5 text-slate-500 hover:bg-slate-50 font-bold transition-colors border-r border-slate-100"
                                >—
                                </button>
                                <input type="number" name="prepTime" value={prepTime}
                                       onChange={(e) => setPrepTime(Math.max(0, parseInt(e.target.value) || 0))}
                                       className="block w-full border-0 py-2.5 pl-3 pr-12 text-sm text-center focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span
                                    className="absolute right-12 text-xs font-medium text-slate-400 pointer-events-none">mins</span>
                                <button type="button" onClick={() => setPrepTime(prev => Number(prev || 0) + 5)}
                                        className="px-3 py-2.5 text-slate-500 hover:bg-slate-50 font-bold transition-colors border-l border-slate-100"
                                >+</button>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Cooking Time</label>
                            <div className="relative mt-1.5 flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
                                <button type="button" onClick={() => setCookingTime(prev => Math.max(0, Number(prev || 0) - 5))}
                                        className="px-3 py-2.5 text-slate-500 hover:bg-slate-50 font-bold transition-colors border-r border-slate-100"
                                >—</button>
                                <input type="number" name="cookingTime" value={cookingTime}
                                       onChange={(e) => setCookingTime(Math.max(0, parseInt(e.target.value) || 0))}
                                       className="block w-full border-0 py-2.5 pl-3 pr-12 text-sm text-center focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />

                                <span className="absolute right-12 text-xs font-medium text-slate-400 pointer-events-none">mins</span>
                                <button type="button" onClick={() => setCookingTime(prev => Number(prev || 0) + 5)}
                                        className="px-3 py-2.5 text-slate-500 hover:bg-slate-50 font-bold transition-colors border-l border-slate-100"
                                >+</button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Recipe Banner Image</label>
                        <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-amber-500 transition-colors bg-slate-50 group cursor-pointer flex flex-col items-center justify-center space-y-1">
                            {imgUrl ? (
                                <img src={imgUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg"/>
                            ) : (
                                <>
                                    <svg className="w-8 h-8 text-slate-400 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                                    </svg>
                                    <p className="text-sm font-medium text-slate-600">Click to Upload Image Banner</p>
                                    <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                                </>
                            )}
                            <input type="file" name="image" accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>

                    <hr className="border-slate-100"/>

                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Ingredients Table</h2>
                            <button type="button" onClick={addIngredient} className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-md transition-colors">+ Add Row</button>
                        </div>
                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                                    <th className="p-3 w-7/12">Ingredient Name</th>
                                    <th className="p-3 w-2/12">Amount</th>
                                    <th className="p-3 w-2/12">Unit</th>
                                    <th className="p-3 w-1/12 text-center"></th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                {ingredients.map((ing, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50">
                                        <td className="p-2">
                                            <input type="text" value={ing.name} onChange={(e) => { const updated = [...ingredients]; updated[index].name = e.target.value; setIngredients(updated); }} placeholder="e.g. Chicken" className="w-full bg-transparent border-0 focus:ring-0 p-1 font-medium text-slate-700 placeholder-slate-300" />
                                        </td>
                                        <td className="p-2">
                                            <input type="text" value={ing.amount} onChange={(e) => { const updated = [...ingredients]; updated[index].amount = e.target.value; setIngredients(updated); }} placeholder="0" className="w-full bg-transparent border-0 focus:ring-0 p-1 font-medium text-slate-700 placeholder-slate-300" />
                                        </td>
                                        <td className="p-2">
                                            <select value={ing.unit} onChange={(e) => { const updated = [...ingredients]; updated[index].unit = e.target.value; setIngredients(updated); }} className="w-full bg-transparent border-0 focus:ring-0 p-1 font-medium text-slate-600 cursor-pointer">
                                                <option value="cups">cups</option>
                                                <option value="table spoons">table spoon</option>
                                                <option value="grams">grams</option>
                                                <option value="pieces">pieces</option>
                                                <option value="liters">liters</option>
                                                <option value="milliliters">milliliters</option>
                                            </select>
                                        </td>
                                        <td className="p-2 text-center">
                                            <button type="button" onClick={() => removeIngredient(index)} className="text-slate-300 hover:text-red-500 transition-colors p-1">&times;</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <hr className="border-slate-100"/>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Instructions (Steps)</h2>
                            <button type="button" onClick={addInstruction} className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-md transition-colors">+ Add Step</button>
                        </div>
                        <div className="space-y-4">
                            {instructions.length === 0 ? (
                                <div className="text-center p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-sm text-slate-400 italic">No cooking steps added yet. Click "+ Add Step" to begin.</div>
                            ) : (instructions.map((step, index) => (
                                <div key={index} className="flex gap-4 items-start group">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-2 shadow-sm">{index + 1}</span>
                                    <div className="flex-grow relative">
                                        <textarea rows={2} value={step} onChange={(e) => { const updated = [...instructions]; updated[index] = e.target.value; setInstructions(updated); }} placeholder="Describe this cooking step..." className="block w-full rounded-lg border-slate-200 py-2 px-3 text-sm focus:border-amber-500 focus:ring-amber-500 border" />
                                    </div>
                                    <button type="button" onClick={() => removeInstruction(index)} className="mt-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-lg leading-none">&times;</button>
                                </div>
                            )))}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100 shrink-0">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors">
                        Cancel
                    </button>
                    {loading ? (
                        <button type="button" className="disabled inline-flex items-center text-body bg-neutral-primary-soft border-0 hover:text-heading focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5">
                            <svg aria-hidden="true" className="w-4 h-4 text-blue-800 text-neutral-tertiary animate-spin fill-brand me-2" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            {selectedRecipe ? 'Updating...' : 'Uploading...'}
                        </button>


                    ) : (
                        <button type="submit"
                                className="px-6 py-2.5 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 shadow-sm shadow-amber-500/20 transition-all hover:shadow">
                            {selectedRecipe ? 'Update Recipe' : 'Upload Recipe'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CreateRecipe;