// import { Response, Request, NextFunction } from "express";
// import { PostService } from "../services/post.service.js";

// export class PostController {
//   static async createNewPost(
//     req: Request,
//     response: Response,
//     next: NextFunction
//   ): Promise<any> {
//     try {
//       const result = await PostService.createPost({
//         ...req.body,
//         user_id: (req as any)?.user?.id,
//       });
//       return response.status(result.code).json(result);
//     } catch (error) {
//       next(error);
//     }
//   }
// }

import { Response, Request, NextFunction } from "express";
import { PostService } from "../services/post.service.js";

export class PostController {
    static async  createNewPost(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        try {
            const result = await PostService.createPost({
                ...req.body,
                user_id: (req as any)?.user?.id,
            });
            return res.status(result.code).json(result);
        } catch (error) {
            next(error);
        }
    }
}

