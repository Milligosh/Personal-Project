import pool from "../config/database/db.js";
import { userQueries } from "../queries/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/env/development.js";



export default interface User {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  phonenumber: string;
  role: string;
  created_at: string;
}

export class CreateUserService {
  static async newUser(body: any): Promise<any> {
    const { firstName, lastName, userName, email, password, phoneNumber } =
      body;

    const userExist: User = (await pool.query(userQueries.fetchUserByEmail, [email])).rows[0];

    if (userExist) {
      throw {
        code: 409,
        message: "User already exists",
        data: null,
        status: "error",
      };
    }

    const userNameExist: User = (await pool.query(userQueries.fetchUserByUsername, [userName])).rows[0];

    if (userNameExist) {
      throw {
        code: 409,
        message: "User already exists",
        data: null,
        status: "error",
      };
    }

    const saltRounds = 12;
    const hashPassword: string = bcrypt.hashSync(password, saltRounds);
    const response = await pool.query(userQueries.createNewUser, [
      firstName,
      lastName,
      userName,
      email,
      hashPassword,
      phoneNumber,
      "user",
    ]);

    return {
      code: 201,
      status: "success",
      message: "New user added successfully",
      data: response.rows[0],
    };
  }

  static async logInUser(body: any): Promise<any> {
    const { email, password } = body;

    const checkIfExist: User = (await pool.query(userQueries.fetchUserByEmail, [email])).rows[0];

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

    const comparePassword: boolean = bcrypt.compareSync(password, databasePassword);

    if (!comparePassword) {
      throw {
        code: 409,
        status: "error",
        message: "Wrong log-In credentials",
        data: null,
      };
    }

    const options: jwt.SignOptions = {
      expiresIn: "1d",
    };

    const token: string = jwt.sign(
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

  static async fetchAll(): Promise<any> {
    const data: User[] = (await pool.query(userQueries.fetchAllUsers)).rows;
    return {
      status: "success",
      message: "Users fetched successfully",
      code: 200,
      data,
    };
  }

  static async editDetails(body: any): Promise<any> {
    const { firstname, lastname, username, email, phonenumber, id } = body;

    const existingUser: User = (await pool.query(userQueries.fetchUserbyId, [id])).rows[0];

    if (!existingUser) {
      return {
        status: "Error",
        message: `User with id ${id} does not exist`,
        code: 400,
        data: null,
      };
    }

    const updateParams: any[] = [];
    const updateFields: string[] = [];

    const addUpdateField = (paramValue: any, paramName: string) => {
      if (paramValue !== undefined) {
        updateParams.push(paramValue);
        updateFields.push(`${paramName}=$${updateParams.length}`);
      }
    };

    addUpdateField(firstname, "firstname");
    addUpdateField(lastname, "lastname");
    addUpdateField(username, "username");
    addUpdateField(email, "email");
    addUpdateField(phonenumber, "phonenumber");

    if (updateParams.length === 0) {
      return {
        status: "Error",
        message: `No fields provided for update`,
        code: 400,
        data: null,
      };
    }

    const updateQuery: string = `UPDATE users SET ${updateFields.join(",")} WHERE id=$${updateParams.length + 1}`;
    updateParams.push(id);

    const data: User = (await pool.query(updateQuery, updateParams)).rows[0];

    return {
      status: "Success",
      message: `User with id ${id} updated successfully`,
      code: 200,
      data,
    };
  }




  static async deleteUser(id:string):Promise<any>{
   const findById:User= (await pool.query(userQueries.fetchUserbyId,[id])).rows[0]
   if (!findById){
    return{
      status: "Error",
    message: `Cannot delete user with id ${id}`,
    code: 400,
    data:null
    }
   }
   else{
    await pool.query(userQueries.deleteUser, [id]);
    return{
      status: "Success",
      message: `User with id ${id} deleted successfully`,
      code: 200,
      data:findById
    }
   }
  }
}
