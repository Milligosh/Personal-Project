import { configDotenv } from "dotenv";
configDotenv();
import * as bcrypt from "bcrypt";
import pool from "../config/database/db.js";

const {
  ADMIN_FIRSTNAME: firstname,
  ADMIN_LASTNAME: lastname,
  ADMIN_USERNAME: username,
  ADMIN_EMAIL: email,
  ADMIN_PASSWORD: password,
  ADMIN_PHONENUMBER: phonenumber,
} = process.env;

const addedAdmin = `
  INSERT INTO users(
    firstname,
    lastname,
    username,
    email,
    password,
    phonenumber,
    role 
  )VALUES($1,$2,$3,$4,$5,$6,$7)RETURNING id,firstname,username,email,phonenumber,role,created_at;
  `;

const saltRounds = 12;
const hashedPassword = bcrypt.hashSync(password as string, saltRounds);

const run = () => {
  console.log("ready to seed in super admin...");
  const response = pool
    .query(addedAdmin, [
      firstname,
      lastname,
      username,
      email,
      hashedPassword,
      phonenumber,
      "admin",
    ])
    .then(() => {
      console.log("seeding completed with no issues.🎉...");
      process.exit(0);
    })
    .catch((e) => {
      console.log("Error", e.message);
      process.exit(1);
    });
};
run();
