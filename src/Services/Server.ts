import { Server as Instance, Socket } from "socket.io";

import { Config } from "../Helpers/Config";

export class Server {

	private static options = {
		withCredentials: true,
		cors: {
			origin: "*",
			methods: ["GET", "POST"]
		}
	};

	public static App = new Instance(Server.options);

	private static Error(socket: Socket, error: Error | any): void {
		try {
			socket.emit("error", { ok: false, data: error });
		} catch (e) {
			throw new Error(e);
		}
	}

	private static Respond(socket: Socket, payload: any): void {
		try {
			socket.emit("response", { ok: true, data: payload.data });
		} catch (e) {
			Server.Error(socket, e);
		}
	}

	public static async Connect(socket: Socket): Promise<void> {
		try {
			await socket.join(socket.id);
			Server.Respond(socket, `joined room ${socket.id}`);
		} catch (e) {
			Server.Error(socket, e);
		}
	}

	public static async Start(): Promise<void> {
		try {
			Server.App.listen(Config.Options.PORT);
			console.log(`socket client serving on http://${Config.Options.DOMAIN}:${Config.Options.PORT}/socket.io/socket.io.js`);
			Server.App.on("connection", async (socket: Socket) => {
				await Server.Connect(socket);
			});
		} catch (error) {
			throw new Error(error);
		}
	}
}