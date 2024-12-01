import pool from "../helpers/db.js";

const postNewPost = async(user_email, group_id, title, content, image) => {
    return pool.query("INSERT INTO group_posts (user_email, group_id, title, content, image) VALUES ($1, $2, $3, $4, $5)",
        [user_email, group_id, title, content, image]
    )
}

const deletePost = async(post_id) => {
    return pool.query("DELETE FROM group_posts WHERE post_id = $1",
        [post_id]
    )
}

export {postNewPost, deletePost}