import "reflect-metadata";
import { dataSource } from "./datasource";
import { buildSchema } from "type-graphql";
import { TagsResolver } from "./controllers/resolvers/Tags";
import { ApolloServer } from "@apollo/server";
import {ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {expressMiddleware} from '@apollo/server/express4';
import { AdsResolver } from "./controllers/resolvers/Ads";
import { CategoriesResolver } from "./controllers/resolvers/Categories";
import { UsersResolver } from "./controllers/resolvers/Users";
import { ContextType, customAuthChecker } from "./auth";
import express from "express";
import http from 'http';
import cors from 'cors';


//modification du serveur avec Express

async function start() {
  // Initialisation datasource
  await dataSource.initialize();
  
  // Création du schéma à partir des Resolver
  const schema = await buildSchema({
    resolvers: [TagsResolver, AdsResolver, CategoriesResolver, UsersResolver],
    authChecker: customAuthChecker,
  });

  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer<ContextType>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/',
    cors<cors.CorsRequest>({
      origin: "http://localhost:3000",
      credentials: true,
    }),
    express.json({ limit: '50mb' }),
    expressMiddleware(server, {
      // Création du contexte
      context: async (args) => {
        return {
          req: args.req,
          res: args.res,
        }
      }
    }),
  );

  await new Promise<void>((resolve) => httpServer.listen({ port: 5001 }, resolve));

  console.log("🚀 Server started at http://localhost:5001/");
}

start();