import jwt from "jsonwebtoken";

export const generateToken = (
  payload: object,
  secret: jwt.Secret,
  expiresIn: string
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (
  token: string,
  secret: jwt.Secret
) => {
  return jwt.verify(token, secret);
};