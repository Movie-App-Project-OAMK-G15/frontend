import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/useUser';
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
                    console.log(response.data); // Log the response to verify the data
                    setProfilePicUrl(response.data.profilePicture);
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
        setProfilePicUrl(URL.createObjectURL(file));
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
            {profilePicUrl && (
                <img 
                src={profilePicUrl} 
                id="profile-pic" 
                alt="Profile" 
                className="img-fluid rounded-circle" 
                style={{ width: '100px', height: '100px' }} 
                onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = 'uploads'; // Set a placeholder image
                }} 
            />
            )}
            {isEditing ? (
                <>
                    <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} />
                    <button className="btn btn-success me-2" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            ) : (
                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
            )}
        </div>
            
    );
}
