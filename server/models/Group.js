import pool from "../helpers/db.js";

// Gets all the info about a specific group using its ID
const getGroupById = async(group_id) => {
    return pool.query("SELECT * FROM groups WHERE group_id = $1",
        [group_id]
    )
}

// Creates a new group with provided info (admin email, name, description, and photo)
const postGroup = async(adm_mail, g_name, description, photo) => {
    return pool.query('insert into groups (admin_email, group_name, description, photo) values ($1, $2, $3, $4) returning *;', 
            [adm_mail, g_name, description, photo])
}

// Fetches all the groups that are currently in the database
const getAllGroups = async() => {
    return pool.query('select * from groups;')
} 

// Gets all subscribers for a given group by its ID
const getAllSubsForGroup = async(group_id) => {
    return pool.query('SELECT * FROM get_group_subscribers($1);',
        [group_id]
    )
}

// Fetches posts along with user info for a specific group
const getPostsGyGroupId = async(group_id) => {
    return pool.query("SELECT * FROM get_posts_with_user_info_by_group($1)",
        [group_id]
    )
}

// Creates a new request to join a group
const postNewRequest = async(group_id, user_email) => {
    return pool.query("INSERT INTO group_requests (user_email, group_id) VALUES ($1, $2);",
        [user_email, group_id]
    )
}

// Gets all the join requests for a specific group by its ID
const getRequestsByGroupId = async(group_id) => {
    return pool.query("SELECT * FROM get_requests_by_group($1)",
        [group_id]
    )
}

// Fetches all join requests across all groups
const getAllRequests = async() => {
    return pool.query("SELECT * FROM group_requests;")
}

// Approves a request to join a group and moves it to subscriptions
const approveRequest = async(req_id) => {
    return pool.query("SELECT * FROM move_request_to_subscription($1);", 
        [req_id]
    )
}

// Gets all the groups a specific user is subscribed to
const getUsersGroups = async(user_email) => {
    return pool.query("SELECT * FROM get_user_group_subscriptions($1);", 
        [user_email]
    )
}

const getUsersOwnGroups = async(user_email) => {
    return pool.query("SELECT * FROM get_user_own_groups($1);", 
        [user_email]
    )
}

// Gets all followers/subscribers across all groups
const getAllFollowers = async() => {
    return pool.query("SELECT * FROM get_all_subscribers();")
}

// Updates group info (name, description, photo) for a specific group ID
const editGroupInfo = async(group_name, description, photo, group_id) => {
    return pool.query("UPDATE groups SET group_name = $1, description = $2, photo = $3 WHERE group_id = $4;",
        [group_name, description, photo, group_id]
    )
}

// Removes a specific user from all their group subscriptions
const removeSubscriber = async(uMail) => {
    return pool.query("DELETE FROM group_subscriptions WHERE user_email = ($1)",
        [uMail]
    )
}

// Deletes a specific join request by its ID
const removeRequest = async(req_id) => {
    return pool.query('delete from group_requests where request_id = $1',
        [req_id]
    )
}

// Deletes a specific group by its ID
const deleteGroup = async(group_id) => {
    return pool.query('DELETE FROM groups WHERE group_id = $1;',
        [group_id]
    )
}

// Lets a user unfollow a group and cleans up related posts/comments
const unfollowGroup = async(group_id, user_email) => {
    const deleteQuery = `
         WITH deleted_subscriptions AS (
            DELETE FROM group_subscriptions
            WHERE group_id = $1 AND user_email = $2
            RETURNING group_id, user_email
        ),
        deleted_posts AS (
            DELETE FROM group_posts
            WHERE group_id = $1 AND user_email = $2
            RETURNING post_id
        ),
        deleted_comments AS (
            DELETE FROM comments
            WHERE user_email = $2 OR post_id IN (SELECT post_id FROM deleted_posts)
            RETURNING comment_id
        )
        SELECT 
            (SELECT COUNT(*) FROM deleted_subscriptions) AS subscriptions_deleted;
    `;
    return pool.query(deleteQuery, [group_id, user_email]
    )
}

// Exporting all the functions so they can be used in other parts of the app
export { postGroup, editGroupInfo, getUsersGroups, getUsersOwnGroups, unfollowGroup, deleteGroup, getAllGroups, getAllSubsForGroup, getPostsGyGroupId, postNewRequest, getAllRequests, getRequestsByGroupId, getGroupById, approveRequest, getAllFollowers, removeSubscriber, removeRequest }
