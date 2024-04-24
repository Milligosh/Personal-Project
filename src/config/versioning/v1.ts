import express from "express";

const api = express.Router();
import users from "../../routes/user.js";

api.get("/", (req, res) =>
  res.status(200).json({
    status: "success",
    message: "Welcome to My App API",
  })
);

api.use("/users", users);
export default api;
