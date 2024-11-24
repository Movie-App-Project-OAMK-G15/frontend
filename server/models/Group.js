import pool from "../helpers/db.js";

const postGroup = async(adm_mail, g_name, description, photo) => {
    return pool.query('insert into groups (admin_email, group_name, description, photo) values ($1, $2, $3, $4) returning *;', 
            [adm_mail, g_name, description, photo])
}

const getAllGroups = async() => {
    return pool.query('select * from groups;')
} 

const getAllSubs = async(group_id) => {
    return pool.query('select * from group_subscriptions;',
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

const getAllRequests = async() => {
    return pool.query("SELECT * FROM group_requests;")
}

export { postGroup, getAllGroups, getAllSubs, getPostsGyGroupId, postNewRequest, getAllRequests }