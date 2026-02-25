import Command from "../model/entities/command";
import PlayerBO from "../controller/player-bo";
import { Result } from "../model/entities";
import SessionBO from "../controller/session-bo";
import cors from "cors";
import express from "express";
import expressWs from "express-ws";

function start() {
  const app: expressWs.Application =
    express() as unknown as expressWs.Application;
  expressWs(app);

  app.use(cors());

  app.post("/register-player", (request, response) => {
    request.on("data", (data) => {
      try {
        const { name } = JSON.parse(data);
        const player = PlayerBO.instance.insert(name);

        response
          .status(200)
          .setHeader("Content-Type", "application/json")
          .send(JSON.stringify(player));
        response.end();
      } catch (error) {
        response.status(400).send(JSON.stringify(error));
        response.end();
      }
    });
  });

  app.post("/join-session", (request, response) => {
    request.on("data", async (data) => {
      const json: Command = JSON.parse(data.toString());
      if (json?.action !== "join_session") {
        response
          .status(400)
          .setHeader("Content-Type", "application/json")
          .send(JSON.stringify({ error: "Invalid command" }));
        response.end();
        return;
      }

      const result = await SessionBO.instance.joinSession(json);
      response
        .status(200)
        .setHeader("Content-Type", "application/json")
        .send(JSON.stringify(result));
      response.end();
    });
  });

  app.ws("/game", (ws, request) => {
    ws.on("message", async (message: Buffer) => {
      const command: Command = JSON.parse(message.toString());
      if (!command) {
        ws.send(JSON.stringify({ error: "Invalid command" }));
      }

      SessionBO.instance.interpretCommand({
        command,
        notifyUpdate: function (update: Result) {
          ws.send(JSON.stringify(update));
        },
      });
    });
    ws.on("error", (error) => {
      console.error(error);
    });
  });

  app.listen(3000, () => {
    console.log("Server listening on port " + 3000);
  });
}

export { start };
