import pool from "../config/database/db.js";
import { userQueries } from "../queries/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/env/development.js";

export class CreateUserService {
  static async newUser(body: any): Promise<any> {
    const { firstName, lastName, userName, email, password, phoneNumber } =
      body;

    const userExist = (await pool.query(userQueries.fetchUserByEmail, [email]))
      .rows[0];

    if (userExist) {
      throw {
        code: 409,
        message: "User already exists",
        data: null,
        status: "error",
      };
    }
    const userNameExist = (
      await pool.query(userQueries.fetchUserByUsername, [userName])
    ).rows[0];

    if (userNameExist) {
      throw {
        code: 409,
        message: "User already exists",
        data: null,
        status: "error",
      };
    }
    const saltRounds = 12;
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    const response = await pool.query(userQueries.createNewUser, [
      firstName,
      lastName,
      userName,
      email,
      hashPassword,
      phoneNumber,
      "user",
    ]);

    //console.log(JSON.stringify(response.rows[0]));

    return {
      code: 201,
      status: "success",
      message: "New user added successfully",
      data: response.rows[0],
    };
  }

  //LOGIN USER
  static async logInUser(body: any): Promise<any> {
    const { email, password } = body;

    const checkIfExist = (
      await pool.query(userQueries.fetchUserByEmail, [email])
    ).rows[0];
    if (!checkIfExist) {
      throw {
        code: 409,
        status: "error",
        message: "User does not have an account",
        data: null,
      };
    }
    const {
      password: databasePassword,
      firstname,
      lastname,
      username,
      role,
      id,
      created_at,
    } = checkIfExist;

    const comparePassword:boolean= await bcrypt.compareSync(
      password,
      databasePassword
    );

    if (!comparePassword) {
      throw {
        code: 409,
        status: "error",
        message: "Wrong log-In credentials",
        data: null,
      };
    }
    const options:object= {
      "expiresIn": "1d",
    };
    const token = jwt.sign(
      {
        id,
        firstname,
        lastname,
        email,
        role,
      },
      config.JWT_SECRET as string,
      options
    );
    return {
      status: "success",
      message: "User login successfully",
      code: 200,
      data: {
        id,
        firstname,
        lastname,
        username,
        email,
        role,
        token,
        created_at,
      },
    };
  }
}
