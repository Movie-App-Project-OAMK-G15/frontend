import pool from "../helpers/db.js";

const getGroupById = async(group_id) => {
    return pool.query("SELECT * FROM groups WHERE group_id = $1",
        [group_id]
    )
}

const postGroup = async(adm_mail, g_name, description, photo) => {
    return pool.query('insert into groups (admin_email, group_name, description, photo) values ($1, $2, $3, $4) returning *;', 
            [adm_mail, g_name, description, photo])
}

const getAllGroups = async() => {
    return pool.query('select * from groups;')
} 

const getAllSubsForGroup = async(group_id) => {
    return pool.query('SELECT * FROM get_group_subscribers($1);',
        [group_id]
    )
}

const getPostsGyGroupId = async(group_id) => {
    return pool.query("SELECT * FROM group_posts WHERE group_id = $1",
        [group_id]
    )
}

const postNewRequest = async(group_id, user_email) => {
    return pool.query("INSERT INTO group_requests (user_email, group_id) VALUES ($1, $2);",
        [user_email, group_id]
    )
}

const getRequestsByGroupId = async(group_id) => {
    return pool.query("SELECT * FROM get_requests_by_group($1)",
        [group_id]
    )
}

const getAllRequests = async() => {
    return pool.query("SELECT * FROM group_requests;")
}

const approveRequest = async(req_id) => {
    return pool.query("SELECT * FROM move_request_to_subscription($1);", 
        [req_id]
    )
}

const getAllFollowers = async() => {
    return pool.query("SELECT * FROM get_all_subscribers();")
}

const removeSubscriber = async(uMail) => {
    return pool.query("DELETE FROM group_subscriptions WHERE user_email = ($1)",
        [uMail]
    )
}

export { postGroup, getAllGroups, getAllSubsForGroup, getPostsGyGroupId, postNewRequest, getAllRequests, getRequestsByGroupId, getGroupById, approveRequest, getAllFollowers, removeSubscriber }