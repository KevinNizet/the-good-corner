import "reflect-metadata";
import { dataSource } from "./datasource";
import { buildSchema } from "type-graphql";
import { TagsResolver } from "./controllers/resolvers/Tags";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { AdsResolver } from "./controllers/resolvers/Ads";
import { CategoriesResolver } from "./controllers/resolvers/Categories";
import { UsersResolver } from "./controllers/resolvers/Users";
import { customAuthChecker } from "./auth";

async function start() {
  //Création du schéma àpd des Resolver
  const schema = await buildSchema({
    resolvers: [TagsResolver, AdsResolver, CategoriesResolver, UsersResolver],
    authChecker: customAuthChecker,
  });

  //Création du serveur Apollo àpd du schéma
  const server = new ApolloServer({
    schema,
  });

  //initialisation datasource
  await dataSource.initialize();
  //lancement du serveur Apollo
  await startStandaloneServer(server, {
    listen: {
      port: 5001,
    },

    //création du contexte
    context: async (args) => {
      return {
       req: args.req,
       res: args.res,
      }
    }
  });

  console.log("🚀 Server started!");
}

start();