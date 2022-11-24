import Container from "typedi";
import { buildSchema } from "type-graphql";
import path = require("path");
import { ChatroomResolver } from "./modules/chat-room/resolvers/chat-room";

export function generateSchema() {
  return buildSchema({
    resolvers: [ChatroomResolver],
    emitSchemaFile: path.resolve(__dirname, "../generated-schema.graphql"),
    container: Container,
  });
}
