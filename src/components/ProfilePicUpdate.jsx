import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/useUser';
import "../styles/ProfilePicUpdate.css"
const url = import.meta.env.VITE_API_URL

export default function UpdateProfilePic() {
    const { user } = useUser ();
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfilePicture = async () => {
            if (user && user.id) {
                try {
                    const response = await axios.get(url + `/user/getpic/${user.id}`, {
                        headers: {
                            'Authorization': user.token
                        }
                    });
                    
                    setProfilePicUrl(response.data);
                } catch (error) {
                    console.error("Error fetching profile picture:", error);
                    setErrorMessage("Failed to fetch profile picture. Please try again.");
                }
            }
        };

        fetchProfilePicture();
    }, [user]);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setProfilePicFile(file);
        let arr = [{user_photo: URL.createObjectURL(file)}]
        setProfilePicUrl(arr);
    };

    const handleSave = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('profilePic', profilePicFile);
    
        try {
            await axios.post(url + `/user/profile-pic/${user.id}`, formData, {
                headers: {
                    'Authorization': user.token,
                }
            });
            alert("Profile picture updated successfully!"); 
            setIsEditing(false);
        } catch (error) {
            console.error('Error occurred while updating the profile picture:', error);
        }
    };

    return (
        <div className="profile-picture-container">
            {profilePicUrl && profilePicUrl.map((pic, index) => 
            <img key={index}
                src={pic.user_photo} 
                id="profile-pic" 
                alt="Profile" 
                className="img-fluid rounded-circle" 
                style={{ width: '100px', height: '100px' }} 
            />)}
            {isEditing ? (
                <>
                    <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} />
                    <button className="bttn btn-save" onClick={handleSave}>Save</button>
                    <button className="bttn btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            ) : (
                <button className="bttn btn-edit" onClick={() => setIsEditing(true)}>Edit</button>
            )}
        </div>       
    );
}
