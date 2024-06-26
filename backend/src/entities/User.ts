/* entity */

import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { IsEmail, Matches } from "class-validator";
  import { Field, ID, ObjectType, InputType, Authorized } from "type-graphql";
import { Ad } from "./Ad";
  
  @Entity()
  @ObjectType()
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id!: number;
  
    @Column({ length: 255, unique: true })
    @Field()
    email!: string;
  
    @Column({ length: 255 })
    /* décorateur field non nécessaire car on ne récupère pas le mdp */
    hashedPassword!: string;

    @OneToMany(() => Ad, (ad) => ad.createdBy)
    @Field(() => [Ad])
    ads!: Ad[];
  }
  
  @InputType()
  export class UserCreateInput {
    @Field()
    @IsEmail()
    email!: string;

    @Field()
    @Matches(/^.{8,50}$/)
    /* mdp pas encore haché à ce stade */
    password!: string;
  }