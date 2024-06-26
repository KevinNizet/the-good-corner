/* resolver */

import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { validate } from "class-validator";
import { User, UserCreateInput } from "../../entities/User";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import cookies from 'cookies';
import Cookies from "cookies";
import { ContextType, getUserFromReq } from "../../auth";


@Resolver(User)
export class UsersResolver {
  @Query(() => [User])
  async allUsers(): Promise<User[]> {
    const users = await User.find();
    return users;
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id", () => ID) id: number): Promise<User | null> {
    const user = await User.findOne({
      where: { id: id },
    });
    return user;
  }

  //query permettant de récupérer son propre profil
  // @Authorized() removed to avoid error
  @Query(() => User, { nullable: true })
  async mySelf(@Ctx() context: ContextType): Promise<User | null> {
    return getUserFromReq(context.req, context.res);
  }

  @Mutation(() => Boolean)
  async signout(@Ctx() context: ContextType): Promise<boolean> {
    //set le cookie à 0, donc périmé = déconnexion
    const cookies = new Cookies(context.req, context.res);
    cookies.set("token", "", {
      httpOnly: true,
      secure: false,
      maxAge: 0,
    });
    return true;
  }

  @Mutation(() => User)
  async signup(
    @Arg("data", () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
    const errors = await validate(data);
    if (errors.length !== 0) {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }

    //error custom si l'utilisateur existe déjà.
    //vient compléter la contrainte d'unicité spécifiée dans l'entité
    const existingUser = await User.findOneBy({ email: data.email });
    if (existingUser) {
      throw new Error(`User already exists`);
    }

    const newUser = new User();
    const hashedPassword = await argon2.hash(data.password);
    Object.assign(newUser, {
      email: data.email,
      hashedPassword,
    });

    await newUser.save();
    return newUser;
  }

  @Mutation(() => User, { nullable: true })
  async signin(
    @Ctx() context: ContextType,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User | null> {
    const existingUser = await User.findOneBy({ email });
    if (existingUser) {
      if (await argon2.verify(existingUser.hashedPassword, password)) {
        const token = jwt.sign(
          {
            //date d'expiration du token
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
            userId: existingUser.id,
          },
          //clé secrete du server
          process.env.JWT_SECRET || "supersecret"
        );

        //modifier le header de réponse pour avoir set-cookie
        //et stocker le token côté client dans les cookies

        const cookies = new Cookies(context.req, context.res);
        cookies.set("token", token, {
          httpOnly: true,
          secure: false,
          maxAge: 1000 * 60 * 60 * 72,
        });

        return existingUser;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}