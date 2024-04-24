import { configDotenv } from "dotenv";
configDotenv();
import bcrypt from "bcrypt";
import pool from "../config/database/db.js";

const {
  SUPER_ADMIN_FIRSTNAME: firstname,
  SUPER_ADMIN_LASTNAME: lastname,
  SUPER_ADMIN_USERNAME: username,
  SUPER_ADMIN_EMAIL: email,
  SUPER_ADMIN_PASSWORD: password,
  SUPER_ADMIN_PHONENUMBER: phonenumber,
} = process.env;

const addSuper = `
    INSERT INTO users(
        firstname,
        lastname,
        username,
        email,
        password,
        phonenumber,
        role
    )VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id,firstname,lastname,username,email,role, created_at
    `;

const saltRounds: number = 12;
const hashPassword = bcrypt.hashSync(password as string, saltRounds);

const func = () => {
  console.log("ready to seed in super admin...");
  const response = pool
    .query(addSuper, [
      firstname,
      lastname,
      username,
      email,
      hashPassword,
      phonenumber,
      "superadmin",
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
func();
