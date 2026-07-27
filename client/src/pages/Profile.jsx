import {useEffect, useRef, useState} from "react";
import defaultPf from './../assets/images/defaultProfile.jpg'
import {supabase} from "../config/supabaseClient.js";
import {useNavigate} from "react-router-dom";
import RecipeList from "../components/RecipeList.jsx";
import NavBar from "../components/NavBar.jsx";
import CreateRecipe from "../components/CreateRecipe.jsx";
import Footer from "../components/Footer.jsx";
import Notification from "../components/Notification.jsx";

const Profile = () =>{
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [imgUrl, setImgUrl] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentView, setCurrentView] = useState("myList");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [noti, setNoti] = useState({show: false, msg:'', type:''});
    const fileInputRef = useRef(null);

    const handleFileChange = async(e) =>{
        const file = e.target.files[0];
        if(!file) return;

        if(file.size > 5 * 1024 * 1024) {
            setNoti({ show: true, msg: "File is too large! Maximum limit is 5MB.", type: "error" });
            return;
        }

        setImgUrl(URL.createObjectURL(file));
        try{
            const fileExtension = file.name.split(".").pop();
            const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2,7)}.${fileExtension}`;
            const filePath = `store_users_pf/${uniqueFileName}`;
            const {data: uploadData, err: uploadError} = await supabase.storage
                .from('users_pf')
                .upload(filePath, file);
            console.log(uploadData);
            if(uploadError){
                console.log(uploadError);
                setNoti({ show: true, msg: 'Profile uploading Error!', type: 'error' });
                return;
            }

            const {data: {publicUrl}} = supabase.storage.from('users_pf').getPublicUrl(filePath);

            const response = await fetch('http://localhost:3000/users/profile',{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    userId: user._id,
                    image: publicUrl
                }),
            });

            if(!response.ok){
                console.log('!response.ok: ',response);
                setNoti({ show: false, msg: 'Profile Uploading Error!', type: 'error' });
                return new Error('Profile updated Error!');
            }

            const data = await response.json();
            if(data.result){
                setUser(data.result);
                setImgUrl(data.result.image || publicUrl)
            }else{
                setUser(prev=>({...prev,image: publicUrl}));
                setImgUrl(publicUrl);
            }
            setNoti({ show: true, msg: 'Profile updated successfully!', type: 'success' });
        } catch(err) {
            console.log(err);
            setNoti({ show: true, msg: "Something went wrong updating profile.", type: "error" });
        }
    };
    const getUser = async() =>{
        fetch("http://localhost:3000/users/me", {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                if(!response.ok){
                    console.log('response: ',response);
                    setNoti({show:true, msg: 'Fail to fetch login data!', type: 'error'});
                    throw new Error('Fail to fetch login data!');
                }
                return response.json();
            })
            .then((data)=>{
                setUser(data.result);
                if(data.result?.image) setImgUrl(data.result.image);
            })
            .catch((err)=>{
                console.log(err)
                setNoti({ show: true, msg: 'Server Error! Fail to fetch user data.', type: 'error' });
            });
    }
    const updateUser = async() =>{
        try{
            fetch("http://localhost:3000/users/me", {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if(!response.ok){
                        console.log('response: ',response);
                        throw new Error('Fail to fetch login data!');
                    }
                    return response.json();
                }).catch((err)=>{
                console.log('error in profile: ',err)
                setNoti({ show: true, msg: 'Server Error during update!', type: 'error' });
            });
        }catch(err){
            console.log('Profile update error: ',err);
            setNoti({ show: true, msg: 'Profile updated Error!', type: 'error' });
        }
    }
    useEffect(() => { getUser() }, []);
    // useEffect(() => {
    //     if (user) {
    //         //console.log('User data:', user);
    //     }
    // }, [user]);

    const logout = ()=> {
        setNoti({show: true, msg: 'Your account is logging out!', type: 'success'});
        setIsSidebarOpen(false);
        setTimeout(()=> {
            localStorage.clear();
            window.dispatchEvent(new Event('local-storage-update'));
            navigate('/home');
        }, 2000);
    }

    return (
        <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col relative overflow-x-hidden">
            {noti.show && (
                <div className="fixed top-5 right-5 z-50">
                    <Notification message={noti.msg} type={noti.type} onClose={() => setNoti({ show: false, msg: "", type: "" })}/>
                </div>
            )}
            <NavBar clickPf={() => setIsSidebarOpen(true)} imgUrl={imgUrl} defaultPf={defaultPf}/>
            <main className="flex-1 w-full max-w-8xl mx-auto p-6 md:p-10 space-y-6">
                <div className="border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight capitalize">
                        {currentView === "myList" ? "Your Recipes" : "Saved Recipes Collection"}
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        {currentView === "myList" ? "Recipes that are created by you.🧑🏼‍🍳" : "Recipes you have bookmarked to try later"}
                    </p>
                </div>

                <section className="w-full pt-2">
                    <RecipeList type={currentView} id={user._id} />
                </section>
            </main>

            {isSidebarOpen && (
                <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity" />
            )}
            <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <span className="font-bold text-slate-700 text-sm tracking-wide">User Control Panel</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 border-b border-slate-100 bg-linear-to-b from-slate-50 to-white relative group">
                    <button onClick={() => { updateUser() }} aria-label="Edit profile"
                            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                        </svg>
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div onClick={() => fileInputRef.current.click()}
                             className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/30 cursor-pointer shadow-inner relative group/photo mb-3">
                            <img className="w-full h-full object-cover" src={imgUrl ? imgUrl : defaultPf} alt="Profile" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity text-white text-[10px] font-medium">Update</div>
                            <input onChange={handleFileChange} ref={fileInputRef} type="file" name="image" accept="image/png, image/jpeg" className='hidden' />
                        </div>

                        <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{user?.name}</h3>
                        <p className="text-xs text-slate-400 font-medium truncate w-full max-w-[240px] mt-0.5">{user?.email}</p>
                        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full mt-2 font-medium">
                            Joined: {user?.createAt ? new Date(user.createAt).toLocaleDateString() : ''}
                        </p>
                    </div>
                </div>
                <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button onClick={() => {setIsSidebarOpen(false); setIsCreateModalOpen(true);}}
                            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-xs transition-colors cursor-pointer mb-4"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                        </svg>
                        Create New Recipe
                    </button>

                    <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase px-2 mb-1">Menus</div>

                    <div onClick={() => {
                        setCurrentView("myList");
                        setIsSidebarOpen(false);
                    }}
                         className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${currentView === 'myList' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2}
                             stroke="currentColor" className="w-5 h-5 opacity-80">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm0 5.25h.007v.008H3.75V12Zm0 5.25h.007v.008H3.75v-.008Z" />
                        </svg>
                        <span>My Recipes List</span>
                    </div>

                    <div onClick={() => { setCurrentView("savedList"); setIsSidebarOpen(false); }}
                         className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${currentView === 'savedList' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 opacity-80">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                        <span>Saved Recipes</span>
                    </div>

                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <button onClick={() => logout()}
                            className="w-full border-1 text-center font-semibold text-red-500 hover:text-white hover:bg-red-600 py-2 rounded-lg transition-colors cursor-pointer">
                        Log Out
                    </button>
                </div>
            </div>
            <CreateRecipe isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} author={user}/>
            <Footer/>
        </div>
    );
};

export default Profile;