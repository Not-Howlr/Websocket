import { Server as Instance } from "socket.io";

import { Config } from "./Config";
import { Database } from "./Database";

export class Server {

	private static options = {
		cors: {
			allowedHeaders: ["jid"],
			credentials: true,
			origin: "*",
			methods: ["GET", "POST"]
		}
	};

	// public static App = require("socket.io")(http.createServer(), Server.options);
	public static App = new Instance(Server.options)

	public static async Start(): Promise<void> {
		try {
			await Database.Connect();
			Server.App.listen(Config.Options.PORT);
			console.log(`socket client serving on http://${Config.Options.HOST}:${Config.Options.PORT}/socket.io/socket.io.js`);
		} catch (error) {
			await Database.Close();
			throw new Error(`${error}`);
		}
	}
}