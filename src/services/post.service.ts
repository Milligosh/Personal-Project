// import pool from "../config/database/db.js";
// import { postQueries } from "../queries/posts.js";
// // import bcrypt from "bcrypt";
// // import jwt from "jsonwebtoken";
// import config from "../config/env/development.js";


// export default interface Post {
//     id: string;
//     post:string;
//     firstname: string;
//     lastname: string;
//     username: string;
//     email: string;
//     password: string;
//     phonenumber: string;
//     role: string;
//     created_at: string;
//   }
  
  
// export class PostService {
//   static async createPost(body: any): Promise<any> {
//     const { post, image_url ,user_id} = body;
//     const posts= await pool.query(postQueries.createPost,[post,image_url,user_id])
//     return{
//         code: 201,
//       status: "success",
//       message: "New Post created successfully",
//       data: posts,
//     }
//   }
// }

import pool from "../config/database/db.js";
import { postQueries } from "../queries/posts.js";

export default interface Post {
    id: string;
    user_id: string;
    post: string;
    image_url: string;
    created_at: string;
    updated_at: string;
}

export class PostService {
    static async createPost(body: any): Promise<any> {
        const { user_id, post, image_url } = body;
        try {
            const { rows } = await pool.query(postQueries.createPost, [user_id, post, image_url]);
            return {
                code: 201,
                status: "success",
                message: "New Post created successfully",
                data: rows[0],
            };
        } catch (error: any) {
            return {
                code: 500,
                status: "error",
                message: "An error occurred while creating the post",
                error: error.message,
            };
        }
    }
}
