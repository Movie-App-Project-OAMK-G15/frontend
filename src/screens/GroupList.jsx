import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ErrorNotification from "../components/ErrorNotification";
import { useUser } from "../context/useUser";
import axios from "axios";
const backendLink = import.meta.env.VITE_API_URL

export default function GroupList(){
    //custom notification/error message state
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [refresh, setRefresh] = useState(false);
    //custom notification/error type
    const [type, setType] = useState("")
    const [requests, setRequests] = useState([])
    const [followers, setFollowers] = useState([])
    const {user, groups, getGroups} = useUser()
    //navigation
    const navigate = useNavigate()
    useEffect(() => {
        async function fetchData() {
            try {
                await getGroups()
                await findRequests()
                await findFollowers()
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Failed to load group data.");
            }
        }
        fetchData();
    }, [refresh])

    async function findRequests() {
        try {
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                }
            };
            const response = await axios.get(backendLink + "/group/allrequests", headers)
            setRequests(response.data)
        } catch (error) {
            alert(error)
        }
    }

    async function findFollowers() {
        try {
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                }
            };
            const response = await axios.get(backendLink + "/group/getfollowersall", headers)
            setFollowers(response.data)
            console.log(response.data)
        } catch (error) {
            alert(error)
        }
    }

    async function handleSubscribe(groupId){
        const userRequest = {
            group_id: groupId,
            user_email: user.email
        }
        const json = JSON.stringify(userRequest)
        const headers = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${user.token}`,
            }
        };        
        try{
            const response = await axios.post(backendLink + '/group/request', json, headers)
            console.log(response.data)
            if(response.data.state){
                alert(response.data.state)
                setRefresh((prev) => !prev);
            } else alert('Error occured, try again later')
        } catch (error) {
            //const message = error.message && error.response.data ? error.response.data.error : error
            setNotificationMessage('Error occured while subscribing to the group. Try to log in again')//custom error notification
            setType('error')//notification type
            console.log(error)
            setTimeout(() => {
                setNotificationMessage(null)
                setType('')
              }, 3000)
        }
    }

    function moveToAdminPanel(id){
        const checkAdm = groups.filter(group => user.email == group.admin_email)
        if (checkAdm.length > 0) {
            navigate(`/groups/admin/${id}`)
        } else {
            alert("You are not an admin!")
        }
    }

    function viewGroupPage(group_id){
        navigate(`/groups/${group_id}`)
    }

    return (
        <>
            <Navbar/>
            <ErrorNotification message={notificationMessage} type={type}/>
            <h2 className="text-white text-center mb-4">List of available groups</h2>
<div
  className="d-flex justify-content-center align-items-center min-vh-100 w-100"
  style={{ overflowX: "hidden" }}
>
  <div className="groups-container row w-100 justify-content-center align-items-center" >
    {groups.map((group) => (
      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4" key={group.group_id}>
        <div
          className="card "
          style={{
            backgroundColor: "#343a40", // Dark background for card
            borderRadius: "5px",
            border: "1px solid orange", // Optional: Add border for consistency
            maxWidth: "700px" 
          }}
        >
          <div className="card-body text-center d-flex flex-column align-items-center">
            <img
              className="card-img-top mb-3"
              src={
                group.photo ||
                "https://via.placeholder.com/150x150/e0fff/FFF?text=No+photo+available+yet+:("
              }
              alt={`${group.group_name} photo`}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "50%", // Circular shape
                border: "2px solid white", // Optional border for better visual contrast
              }}
            />
            <h5 className="card-title text-warning">{group.group_name}</h5>
            <p className="card-text text-light">{group.description}</p>

            {/* Conditional button rendering based on user's state */}
            {user.email === group.admin_email ? (
              <button
                className="btn btn-primary mt-2"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation
                  moveToAdminPanel(group.group_id);
                }}
              >
                Admin panel
              </button>
            ) : user.token ? (
              requests.some(
                (req) => req.user_email === user.email && group.group_id === req.group_id
              ) ? (
                <button
                  className="btn btn-secondary mt-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    alert(
                      "Your request to join the group is still pending. Wait for group admin to approve it."
                    );
                  }}
                >
                  Request pending
                </button>
              ) : followers.some(
                (follower) =>
                  follower.email === user.email && follower.group_ids.some((gId) => gId === group.group_id)
              ) ? (
                <button
                  className="btn btn-success mt-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    viewGroupPage(group.group_id); // Function to view group page
                  }}
                >
                  View page
                </button>
              ) : (
                <button
                  className="btn btn-dark mt-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    handleSubscribe(group.group_id);
                  }}
                >
                  Subscribe
                </button>
              )
            ) : (
              <button
                className="btn btn-secondary mt-2"
                onClick={(e) => e.stopPropagation()}
              >
                Log in to subscribe
              </button>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>






        </>
    )
}