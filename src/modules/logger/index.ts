import Container from "typedi";
import { createLogger, format, transports } from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";

const esTransportOpts = {
  level: "debug",
  clientOpts: { node: "http://chat-log-elasticsearch-1:9200" },
};
const esTransport = new ElasticsearchTransport(esTransportOpts);
esTransport.flush();

const logger = createLogger({
  format: format.combine(format.errors({ stack: true })),
  defaultMeta: { service: "chatroom" },
  transports: [esTransport],
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

export type ILogger = typeof logger;

Container.set("logger", logger);
