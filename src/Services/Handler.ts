/* eslint-disable no-unused-vars */
import { Socket } from "socket.io";
import { IUser } from "@not-howlr/types";

import { INewMessage, MessageRepository } from "../Repositories/Messages";
import { Server } from "./Server";
import { Jwt } from "./Jwt";
import { Database } from "./Database";

enum HandlerTypes {
	CONNECION = "connection",
	ERROR = "error",
	RESPONSE = "response",
	SEND_MESSAGE = "send_message",
	RECIEVE_MESSAGE = "recieve_message",
}

export class Handler {

	private static Socket = Server.App;

	/**
	 * Send Generic Error Message To Connected Client
	 *
	 * @private
	 * @static
	 * @param {Socket} socket
	 * @param {*} error
	 * @memberof Handler
	 */
	private static Error(socket: Socket, error: any): void {
		socket.emit(HandlerTypes.ERROR, { ok: false, data: error });
	}

	/**
	 * Send Generic Response Mesaage To Connected Client
	 *
	 * @private
	 * @static
	 * @param {Socket} socket
	 * @param {*} data
	 * @memberof Handler
	 */
	private static Respond(socket: Socket, data: any): void {
		socket.emit(HandlerTypes.RESPONSE, { ok: true, data });
	}

	/**
	 * Verify A Connected User Credentials
	 *
	 * @private
	 * @static
	 * @param {Socket} socket
	 * @return {*}  {IUser}
	 * @memberof Handler
	 */
	private static Verify(socket: Socket): IUser {
		const cookie = socket.handshake.headers.cookie;
		const jid = cookie && cookie.split("jid=")[1];
		const auth = jid && Jwt.Verify(jid);
		if (!auth) socket.disconnect();
		return auth as IUser;
	}

	/**
	 * Send Direct Message To One User
	 *
	 * @private
	 * @static
	 * @param {Socket} socket
	 * @param {string} to
	 * @param {INewMessage} data
	 * @memberof Handler
	 */
	private static RecieveMessage(socket: Socket, to: string, data: INewMessage): void {
		socket.to(to).emit(HandlerTypes.RECIEVE_MESSAGE, { ok: true, data });
	}

	/**
	 * Send A Message From One User and Notify The Recipient
	 *
	 * @private
	 * @static
	 * @param {Socket} socket
	 * @param {INewMessage} data
	 * @return {*}  {Promise<void>}
	 * @memberof Handler
	 */
	private static async SendMessage(socket: Socket, data: INewMessage): Promise<void> {
		const user = Handler.Verify(socket);
		await MessageRepository.Insert(Database.Manager.fork(), {
			from: user.uid,
			to: data.to,
			content: data.content,
			sent: new Date(data.sent)
		});
		Handler.RecieveMessage(socket, data.to, data);
		Handler.Respond(socket, "message sent");
	}

	/**
	 * Attempt To Connect A User To A Room By Their UID
	 *
	 * @static
	 * @param {Socket} socket
	 * @return {*}  {Promise<void>}
	 * @memberof Handler
	 */
	public static async Connect(socket: Socket): Promise<void> {
		const user = Handler.Verify(socket);
		if (!user) socket.disconnect();
		await socket.join(user.uid);
		Handler.Respond(socket, `joined room ${user.uid}`);
	}


	public static async Init() {
		await Server.Start();
		Handler.Socket.on(HandlerTypes.CONNECION, async (socket: Socket) => {
			try {
				await Handler.Connect(socket);
				socket.on(HandlerTypes.SEND_MESSAGE, async (data: INewMessage) => await Handler.SendMessage(socket, data));
			} catch (error) {
				Handler.Error(socket, error);
			}
		});
	}
}