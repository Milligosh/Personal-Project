/* Replace with your SQL commands */
CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    user_id SERIAL REFERENCES users(id) ON DELETE CASCADE,
    post VARCHAR,
    image_url varchar(100),
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
)