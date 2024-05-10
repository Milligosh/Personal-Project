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

  
  static async fetchAll():Promise<any>{
  const data= (await pool.query(userQueries.fetchAllUsers)).rows
  return{
    status: "success",
    message: "Users fetched successfully",
    code: 200,
    data
  }
  }

//   static async editDetails( body:any):Promise<any>{
// const {firstname,lastname,username,email,phonenumber,id}= body
// const findById= (await pool.query(userQueries.fetchUserbyId,[id])).rows[0]
//   if (!findById){
//     return{
//       status: "Error",
//     message: `User with id ${id} does not exist`,
//     code: 400,
//     data:null
//     }
//   }
  

//   const data= (await pool.query(userQueries.updateUser,[firstname,lastname,username,email,phonenumber,id])).rows[0]
//   return{
//     status: "Success",
//     message: `User with id ${id} updated successfully`,
//     code: 200,
//     data
//   }
//   }
static async editDetails(body: any): Promise<any> {
  const { firstname, lastname, username, email, phonenumber, id } = body;

  const existingUser = (await pool.query(userQueries.fetchUserbyId, [id])).rows[0];
  if (!existingUser) {
      return {
          status: "Error",
          message: `User with id ${id} does not exist`,
          code: 400,
          data: null
      };
  }

  const updateParams = [];
  const updateFields:any = [];

  const addUpdateField = (paramValue:any, paramName:any) => {
      if (paramValue !== undefined) {
          updateParams.push(paramValue);
          updateFields.push(`${paramName}=$${updateParams.length}`);
      }
  };

  addUpdateField(firstname, 'firstname');
  addUpdateField(lastname, 'lastname');
  addUpdateField(username, 'username');
  addUpdateField(email, 'email');
  addUpdateField(phonenumber, 'phonenumber');

  if (updateParams.length === 0) {
      return {
          status: "Error",
          message: `No fields provided for update`,
          code: 400,
          data: null
      };
  }

  const updateQuery = `UPDATE users SET ${updateFields.join(',')} WHERE id=$${updateParams.length + 1}`;
  updateParams.push(id);

  // Perform the update with the dynamic update query
  const data = (await pool.query(updateQuery, updateParams)).rows[0];

  return {
      status: "Success",
      message: `User with id ${id} updated successfully`,
      code: 200,
      data
  };
}


  static async deleteUser(id:string):Promise<any>{
   const findById= (await pool.query(userQueries.fetchUserbyId,[id])).rows[0]
   console.log(findById)
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
