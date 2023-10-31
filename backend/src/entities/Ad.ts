import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Length, ValidateIf } from "class-validator";
import { Category } from "./Category";
import { Tag } from "./Tag";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import { ObjectId } from "./ObjectId";


@Entity()
@ObjectType()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column()
  title!: string;

  @Column()
  price!: number;

  @Column()
  imgUrl!: string;

  @Column({ nullable: true })
  @Length(0, 5000)
  @ValidateIf((object, value) => !!value)
  description!: string;

  @ManyToOne(() => Category, (category) => category.ads)
  category!: Category;

  @ManyToMany(() => Tag, (tag) => tag.ads)
  // check with SQLite extension! If you forget this following line, the
  // pivot table won't be generated
  @JoinTable()
  tags!: Tag[];

  @CreateDateColumn()
  createdAt!: Date;
}

@InputType()
export class AdInput {
  @Field()
  title!: string;

  @Field(() => Int)
  price!: number;

  @Field()
  imgUrl!: string;

  @Field()
  description!: string;

  @Field()
  category!: ObjectId;

  @Field(() => [ObjectId])
  tags!: ObjectId[];
}