import express from "express";

const api = express.Router();
import users from "../../routes/user.js";
 import posts from "../../routes/posts.js"

api.get("/", (req, res) =>
  res.status(200).json({
    status: "success",
    message: "Welcome to My App API",
  })
);

api.use("/users", users);
api.use("/posts", posts )
export default api;
