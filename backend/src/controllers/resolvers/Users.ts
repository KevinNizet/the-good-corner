/* resolver */

import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { validate } from "class-validator";
import { User, UserCreateInput } from "../../entities/User";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Token } from "graphql";

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
    const existingUser = await User.findBy({email: data.email});
      if(existingUser) {
        throw new Error(`User already exists`);
    }

    const newUser = new User();
    const hashedPassword = await argon2.hash(data.password);
    Object.assign(newUser, {
        email: data.email,
        hashedPassword
    });

      await newUser.save();
      return newUser;
    
  }

  @Mutation(() => User, { nullable: true})
  async signin(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User | null> {


    const existingUser = await User.findOneBy({email});
      if(existingUser) {
        if (await argon2.verify(existingUser.hashedPassword, password)) {

          const token = jwt.sign(
            {
              //date d'expiration du token
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
              userId: existingUser.id, 
            }, 
            //clé secrete du server
            "548b65a3-1b86-495f-85a5-5f4d047adc47"
          );

          console.log(token)


          return existingUser;
        } else {
          return null;
        }
    } else {
      return null;
    }

}

}