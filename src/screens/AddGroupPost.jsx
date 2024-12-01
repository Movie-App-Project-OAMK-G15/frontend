import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUser } from "../context/useUser"
import Navbar from "../components/Navbar"
import axios from "axios"
import 'bootstrap'
const url = import.meta.env.VITE_API_URL

export default function AddGroupPosts(){
    const [pTitle, setpTitle] = useState("")
    const [pContent, setpContent] = useState("")
    const [postImage, setPostImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const navigate = useNavigate()
    const {user} = useUser()
    const {groupId} = useParams()

    function handleFileChange(event){
        setPostImage(event.target.files[0]);
    }

    async function handleSubmit(event){
        event.preventDefault()
        setLoading(true)
        const formData = new FormData();
        formData.append("user_email", user.email); 
        formData.append("group_id", groupId);        
        formData.append("title", pTitle); 
        formData.append("content", pContent); 
        formData.append("photo", postImage);
        const headers = {
            headers: {
                "Authorization": `${user.token}`,
            }
        };    
        try{
            const response = await axios.post(url + '/posts/newpost', formData, headers)
            console.log(response.data)
            if(response.data.state){
                setLoading(false)
                setResponseData(response.data.state)
                alert(response.data.state)
            } else alert('Error occured, try again later')
        } catch (error) {
            alert(error)
        }
    }

    return (
        <>
            <Navbar/>
            <div className="container mt-4">
            {loading && <div className="alert alert-info text-center">Loading...</div>}
            {responseData && (
                <div className="alert alert-success text-center">
                    <h3>New post was added!</h3>
                    <button className="btn btn-primary" onClick={() => navigate(`/groups/${groupId}`)}>Back to group</button>
                </div>
            )}
            <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <div className="mb-3">
                    <label htmlFor="post_title" className="form-label">
                        Post Title:
                    </label>
                    <input
                        id="post_title"
                        type="text"
                        value={pTitle}
                        onChange={(event) => setpTitle(event.target.value)}
                        className="form-control"
                        placeholder="Enter the post title"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="post_content" className="form-label">
                        Post Content:
                    </label>
                    <textarea
                        id="post_content"
                        value={pContent}
                        onChange={(event) => setpContent(event.target.value)}
                        className="form-control"
                        rows="6" // Makes the content input larger
                        placeholder="Write your post content here"
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="post_image" className="form-label">
                        Post Image:
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="form-control"
                        id="post_image"
                    />
                </div>
                <div className="text-center">
                {!loading && 
                <button id="create_post" className="btn btn-success">
                    Create Post
                </button>
                }
                </div>
            </form>
        </div>

        </>
    )
}