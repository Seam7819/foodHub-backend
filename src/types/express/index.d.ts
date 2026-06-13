import { JwtPayload } from "../../app/interfaces/jwtPayload";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};