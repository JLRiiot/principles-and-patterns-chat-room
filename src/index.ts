import "reflect-metadata";
import "./modules/logger";

import express, { Application, Request, Response, NextFunction } from "express";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import cors from "cors";
import { generateSchema } from "./generate-schema";
import { morganMiddleware } from "./modules/middlewares/morgan";

const configuredPort = process.env.PORT || "8080";

const startServer = async (port: string | undefined) => {
  const app: Application = express();
  const generatedSchema = await generateSchema();

  const server = new ApolloServer({
    schema: generatedSchema,
    validationRules: [],
  });

  app.use(cors());
  app.use(morganMiddleware());
  await server.start();

  server.applyMiddleware({ app, path: "/graphql" });
  const httpServer = createServer(app);

  httpServer.listen({ port }, () => {
    console.log("🚀️🌘️ GraphQL running 🔥");
  });
};

startServer(configuredPort)
  .then(() => {
    console.log(`🚀️🌘️ Server is running`);
  })
  .catch((error) => {
    console.error(`💩️ The server crashed with error: 💩️`);
    console.error(error);
  });
