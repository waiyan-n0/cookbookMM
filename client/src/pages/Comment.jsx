import { useState, useEffect } from "react";
import Notification from "../components/Notification.jsx";

const Comment = ({ recipeId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [visibleCount, setVisibleCount] = useState(3);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [noti, setNoti] = useState({show:false, msg:"",type:""});
    const [currentUserId, setCurrentUserId] = useState(null);

    const token = localStorage.getItem("token");
    useEffect(() => {
        if (token) {
            try {
                const payloadBase64 = token.split('.')[1];
                const decodedJson = atob(payloadBase64);
                const decoded = JSON.parse(decodedJson);
                const userId = decoded.id || decoded._id || decoded.userId;
                setCurrentUserId(userId);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [token]);
    //console.log('user Id: ', currentUserId);
    useEffect(() => {
        if (!recipeId) return;

        let isMounted = true;

        fetch(`http://localhost:3000/interactions/${recipeId}/comments`)
            .then((res) => res.json())
            .then((data) => {
                if (isMounted && data.con) {
                    setComments(data.result || []);
                }
            })
            .catch((err) => console.error("Error fetching comments:", err));

        return () => {
            isMounted = false;
        };
    }, [recipeId]);
    //console.log('comment: ',comments)
    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        if (!token) {
            alert("Please login to write a comment!");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("http://localhost:3000/interactions/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    recipe_id: recipeId,
                    text: newComment
                })
            });

            const data = await response.json();
            if (response.ok && data.con) {
                setComments((prev) => [data.result, ...prev]);
                setNewComment("");
            } else {
                setNoti({show:true, msg: data.msg || "Failed to post comment! Please Try Again.", type: "error"});
                //alert(data.msg || "Failed to post comment");
            }
        } catch (err) {
            console.error("Error posting comment:", err);
        } finally {
            setIsSubmitting(false);
        }
    };
    const deleteComment = async(commentId) => {
        if (!commentId) {
            setNoti({show:true,msg: 'Error deleting comment!(undefined)', type: "error"});
            return;
        }
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try{
            const response = await fetch(`http://localhost:3000/interactions/comment`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({comment_id: commentId})
            })
            const data = await response.json();
            if (response.ok && data.con) {
                setNoti({show:true, msg: data.msg || "Comment have been deleted successfully.", type: "success" });
                setComments((prevComments) =>
                    prevComments.filter((item) => item._id !== commentId)
                );
            } else {
                setNoti({show:true, msg: data.msg || "Failed to delete comment! Please Try Again.", type: "error"});
                //alert(data.msg || "Failed to delete comment!");
            }
        }catch(err){
            console.log('Error deleteing comment: ', err);
            new Error('Error deleting comment!');
        }
    }
    const handleSeeMore = () => {
        setVisibleCount((prevCount) => prevCount + 7);
    };
    // console.log('count: ', visibleCount)
    // console.log('recipe_id:',recipeId);
    //console.log('cur id:',currentUserId);
    //console.log('comments: ',comments.map(cmt=>cmt.user_id));
    return (
        <section className="w-full mx-auto mt-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            {noti.show && (
                <div className="fixed top-5 right-5 z-50">
                    <Notification message={noti.msg} type={noti.type} onClose={() => setNoti({ show: false, msg: "", type: "" })}/>
                </div>
            )}
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                Comments
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {comments.length}
                </span>
            </h3>

            <form onSubmit={handlePostComment} className="mb-6">
                <div className="flex flex-col gap-2">
                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
                        placeholder={token ? "Write an honest review or question..." : "Please log in to leave a comment"}
                        disabled={!token} rows={3}
                        className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none transition-all"
                    />
                    {token && (
                        <button type="submit" disabled={isSubmitting || !newComment.trim()}
                            className="self-end px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Posting..." : "Post Comment"}
                        </button>
                    )}
                </div>
            </form>
            <hr className="border-gray-100 my-4" />
            {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
                    <p className="text-sm font-medium text-gray-700">No comments yet</p>
                    <p className="text-xs text-gray-400 mt-0.5">Be the first to share your thoughts and write a first comment!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {comments.slice(0, visibleCount).map((comment) => (
                        <div key={comment._id} className="flex gap-3 items-start p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-sm uppercase">
                                {comment.author?.name ? comment.author.name.charAt(0) : "U"}
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-700">
                                        {comment.author?.name || "Anonymous"}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line flex justify-between">
                                    {comment.text}
                                    {comment.user_id===currentUserId ? (
                                        <span onClick={() => deleteComment(comment._id) }
                                            className='hover:text-red-500 cursor-pointer '>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                        </svg>
                                    </span>
                                    ):(<span></span>)
                                    }
                                </p>
                            </div>
                        </div>
                    ))}
                    {comments.length > visibleCount && (
                        <button onClick={handleSeeMore}
                                className="text-center text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors py-2 mt-2 border border-dashed border-gray-200 rounded-xl hover:bg-amber-50/30">
                            See More Comments (+{comments.length - visibleCount} more)
                        </button>
                    )}
                </div>
            )}
        </section>
    );
};

export default Comment;