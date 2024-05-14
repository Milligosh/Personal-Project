import { Request, Response, NextFunction } from "express";
import { CreateUserService } from "../services/user.service.js";

export class UserController {
  static async newUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const result = await CreateUserService.newUser(request.body);
      return response.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async logUserIn(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const result = await CreateUserService.logInUser(request.body);
      return response.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async fetchingAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const result = await CreateUserService.fetchAll();
      return response.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async editDetails(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      //  const {id}= request.params.id
      const result = await CreateUserService.editDetails({
        ...request.body,
        id: request.params.id,
      });
      return response.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deletefromDB(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      //  const {id}=request.params.id
      const result = await CreateUserService.deleteUser(request.params.id);
      return response.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }
}
