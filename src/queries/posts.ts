
export const postQueries = {
    createPost: `
        INSERT INTO posts (
            user_id,
            post,
            image_url
        ) VALUES ($1, $2, $3) RETURNING *`
};
