import morgan from "morgan";
import { Container } from "typedi";
import { ILogger } from "../logger";

export const morganMiddleware = () => {
  const logger = Container.get("logger") as ILogger;
  const stream = {
    // Use the http severity
    write: (message: any) => logger.http(message),
  };

  const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
  };
  return morgan(
    (tokens, req, res) => {
      return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: Number.parseFloat(tokens.status(req, res) || "0"),
        content_length: tokens.res(req, res, "content-length"),
        response_time: Number.parseFloat(
          tokens["response-time"](req, res) || "0"
        ),
      });
    },
    {
      stream: {
        write: (message: string) => {
          logger.http("incoming-request", JSON.parse(message));
        },
      },
    }
  );
};
