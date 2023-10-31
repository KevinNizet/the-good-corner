import "reflect-metadata";
import { dataSource } from "./datasource";
import { buildSchema } from "type-graphql";
import { TagsResolver } from "./controllers/resolvers/Tags";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { AdsResolver } from "./controllers/resolvers/Ads";

async function start() {
  //Création du schéma àpd des Resolver
  const schema = await buildSchema({
    resolvers: [TagsResolver, AdsResolver],
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
  });

  console.log("🚀 Server started!");
}

start();