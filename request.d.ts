import { Request } from 'express';
import User from './src/services/user.service'
//Extend the Request interface to include the user property
declare module 'express' {
  interface Request {
    user?: User;
    passedFiles?: {
      filesOver2MB: File[];
      filesUnder2MB: File[];
    };
  }
}
// import { Request } from 'express'
// declare module 'express' {
//     interface Request {
//         user?: any;
//     }
// }
