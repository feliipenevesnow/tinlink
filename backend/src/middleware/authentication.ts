import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { TokenExpiredError } from "jsonwebtoken";

const extractToken = (req: Request) => {
  const authorization = req.headers.authorization || ''
  
  return authorization.replace('Bearer ', '')
}

export class AuthenticationService {
  validate(request: Request, response: Response, next: NextFunction) {
    const token = extractToken(request);

    if (!token)
      return response
        .status(401)
        .json({ auth: false, message: "No token provided." });
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
      if(!request.url.includes('/validate/valid'))
        next();
      else
        return response.status(200).json({auth: true, message: 'User is authenticated'})
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return response
          .status(401)
          .json({ auth: false, message: "The session ended." });
      }
      return response
        .status(500)
        .json({ auth: false, message: "Failed to authenticate token." });
    }
  }
};
