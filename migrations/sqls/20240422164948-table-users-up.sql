/* Replace with your SQL commands */
CREATE TYPE role_type as ENUM ('user','admin','superadmin');
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    userName VARCHAR(255)UNIQUE,
    email VARCHAR (255)UNIQUE,
    password VARCHAR(255),
    phoneNumber VARCHAR(255),
    role role_type,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
)