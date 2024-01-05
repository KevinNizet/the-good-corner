import { AuthChecker } from "type-graphql";
import Cookies from "cookies";
import jwt from 'jsonwebtoken';
import { User } from "./entities/User";

export type ContextType = {
    req: any;
    res: any;
    user?: User;
}

// Middleware appelé à chaque fois que le décorateur @Authorized est utilisé sur les champs protégés

export async function getUserFromReq(req: any, res: any): Promise<User | null> {

  const cookies = new Cookies(req, res);
    const token = cookies.get('token');

    if (!token) {
        console.error('Missing token');
        return null;
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
  
      if (typeof payload === "object" && "userId" in payload) {
        const user = await User.findOneBy({ id: payload.userId });
  
        if (user !== null) {
          return Object.assign(user, { hashedPassword: undefined });
        } else {
          console.error("user not found");
          return null;
        }
      } else {
        console.error("invalid token, msising userid");
        return null;
      }
    } catch {
      console.error("invalid token");
      return null;
    }
  }
  
  export const customAuthChecker: AuthChecker<ContextType> = async (
    { root, args, context, info },
    roles
  ) => {
    const connectedUser = await getUserFromReq(context.req, context.res);
  
    if (connectedUser) {
      context.user = connectedUser;
      return true;
    } else {
      return false;
    }
  };