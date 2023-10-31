import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Tag {
    //Field accepte une fonction en paramètre, qui indique la valeur de type ID
    @Field(() => ID)
    //! indique que l'on n'initialise pas encore la variable
    id!: number;

    @Field()
    name!: string;
}