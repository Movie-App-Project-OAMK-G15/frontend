import pool from "../helpers/db.js";

// adds a new post to the group, takes user email, group id, title, content, n an image
const postNewPost = async(user_email, group_id, title, content, image) => {
    return pool.query("INSERT INTO group_posts (user_email, group_id, title, content, image) VALUES ($1, $2, $3, $4, $5)",
        [user_email, group_id, title, content, image]
    )
}

// deletes a post by its id, pretty straightforward
const deletePost = async(post_id) => {
    return pool.query("DELETE FROM group_posts WHERE post_id = $1",
        [post_id]
    )
}

// exporting the functions so they can be used somewhere else in the app
export {postNewPost, deletePost}
