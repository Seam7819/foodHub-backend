import { NextFunction, Request, Response } from "express";
import config from "../../config.js";
import { verifyToken } from "../../helpers/jwtHelper.js";

const auth =
  (...requiredRoles: string[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authorization =
        req.headers.authorization;

      if (!authorization) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized Access",
        });
      }

      const token = authorization.split(" ")[1];

      const decoded = verifyToken(
        token as string,
        config.jwt.accessSecret
      ) as {
        id: string;
        role: string;
      };

      req.user = decoded;

      if (
        requiredRoles.length &&
        !requiredRoles.includes(decoded.role)
      ) {
        return res.status(403).json({
          success: false,
          message: "Forbidden Access",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
  };

export default auth;