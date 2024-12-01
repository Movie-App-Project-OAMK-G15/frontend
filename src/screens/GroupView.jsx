import { useUser } from "../context/useUser"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "bootstrap"
import axios from "axios"
import Navbar from "../components/Navbar"
import '../styles/GroupView.css'
import {format} from "date-fns"
const url = import.meta.env.VITE_API_URL

export default function GroupView(){
    const {currentGroup, getGroupById, user} = useUser()
    const [subs, setSubs] = useState([])
    const [posts, setPosts] = useState([])
    const {groupId} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        getGroupById(groupId)
        getSubsForGroup()
        getPosts()
    }, [])

    async function getPosts() {
        try {
            const json = JSON.stringify({group_id: groupId})
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`,
                }
            }; 
            const response = await axios.post(url + '/group/getpostsfrogroup', json, headers)
            setPosts(response.data)
            console.log(response.data)
        } catch (error) {
            alert(error)
        }
    }

    async function getSubsForGroup() {
        try {
            const json = JSON.stringify({group_id: groupId})
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`,
                }
            };        
        
            const response = await axios.post(url + '/group/getfollowers', json, headers)
            console.log(response.data)
            setSubs(response.data)
        } catch (error) {
            alert(error)
        }
    }

    async function deletePost(id){
        try {
            const json = JSON.stringify({post_id: id})
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`,
                }
            }; 
            const response = await axios.post(url + '/posts/deletepost', json, headers)
            if(response.status){
                alert("Post has been deleted")
                setPosts(posts.filter(post => post.post_id != id))
            }
        } catch (error) {
            alert(error)
        }
    }

    async function unfollowGroup(){
        try {
            const json = JSON.stringify({group_id: groupId, user_email: user.email})
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`,
                }
            }; 
            const response = await axios.post(url + '/group/unfollow', json, headers)
            if(response.status){
                alert("You unfollowed the group")
                navigate('/groups')
            }
        } catch (error) {
            alert(error)
        }
    }

    return (
        <>
    <Navbar />
    {currentGroup.map((item) => (
        <div key={item.group_id} className="container mt-4">
            <div className="row justify-content-center">
            {/* Group Header */}
            <div className="col-12 col-md-9">
                <div className="p-3 shadow-sm bg-white rounded">
                <div className="d-flex align-items-center">
                    <img
                    src={`${item.photo}` || "https://via.placeholder.com/100x100"}
                    alt={`${item.group_name} logo`}
                    className="img-fluid rounded me-4"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <div>
                    <p className="group-name mb-1 e-5">{item.group_name}</p>
                    <p className="group-description text-muted mb-0">{item.description}</p>
                    </div>
                    <div className="ms-auto">
                    {user.email == item.admin_email ? 
                    <button className="btn btn-danger" onClick={() => navigate(`/groups/admin/${groupId}`)}>Admin panel</button>
                    :
                    <button className="btn btn-danger" onClick={unfollowGroup}>Unfollow</button>
                    }
                    </div>
                </div>
                </div>
            </div>

            {/* Subscribers Section */}
            <div className="col-12 col-md-9 mt-3">
                <div className="p-3 shadow-sm bg-white rounded">
                <p className="fw-bold mb-3">
                    Subscribers <span className="text-muted">({subs.length})</span>
                </p>
                <div className="d-flex flex-wrap justify-content-start">
                    {subs.slice(0, 8).map((sub, index) => (
                    <div key={index} className="text-center me-3 mb-3">
                        <img
                        src={sub.photo ? `/server${sub.photo}` : "https://via.placeholder.com/50x50"}
                        alt={`${sub.firstname} photo`}
                        className="subscriber-photo rounded-circle"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <p className="subscriber-name mt-2 small">{sub.firstname}</p>
                    </div>
                    ))}
                </div>
                </div>
            </div>

            {/* Group Posts Section */}
            <div className="col-12 col-md-9 mt-4">
            <h2 className="mb-3">Posts</h2>
            {/* Add New Post Button */}
            <div className="d-flex justify-content-center mb-4">
                <button className="btn btn-primary" onClick={() => navigate(`/groups/newpost/${groupId}`)}>+ Add New Post</button>
            </div>
                <div className="row">
                {[...posts].reverse().map((post, index) => (
                    <div className="col-12 mb-4" key={index}>
                    <div className="border rounded p-3 bg-light">
                        {/* User Info */}
                        <div className="d-flex align-items-center mb-2">
                            {post.email == item.admin_email ? 
                            <div>
                                <strong>{post.firstname} {post.familyname} (ADMIN)</strong>
                            </div>
                            :
                            <div>
                                <strong>{post.firstname} {post.familyname}</strong>
                            </div>
                        }
                        
                        <div className="ms-auto text-muted small">
                            posted: {format(new Date(new Date(post.created_at).setHours(new Date(post.created_at).getHours() + 2)), 'dd.MM.yyyy HH:mm')}
                        </div>
                        </div>
                        {/* Post Title */}
                        <h5 className="fw-bold mb-2">{post.title}</h5>
                        {/* Post Content */}
                        <p className="mb-3">{post.content}</p>
                        {/* Post Image */}
                        {post.image && (
                        <div
                            className="d-flex justify-content-center align-items-center mb-3"
                            style={{ height: '300px', backgroundColor: '#f8f9fa', overflow: 'hidden' }}
                        >
                            <img
                            src={post.image}
                            alt={post.title}
                            className="img-fluid"
                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        )}
                        {user.email === item.admin_email || user.email === post.email ? (
                            <button
                                onClick={() => deletePost(post.post_id)}
                                className="btn btn-danger btn-sm" 
                            >
                                Delete
                            </button>
                        ) : null}
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>
        ))}
    </>
    )
}