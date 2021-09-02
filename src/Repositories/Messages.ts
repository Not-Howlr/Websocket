import { MongoDriver, MongoEntityManager } from "@mikro-orm/mongodb";

import { Message } from "../Models/Message";

type Manager = MongoEntityManager<MongoDriver>

export interface INewMessage {
	to: string,
	from: string,
	content: string,
	sent: Date
}

export class MessageRepository {

	public static async Insert(manager: Manager, message: INewMessage): Promise<boolean> {
		try {
			const newMessage = new Message({
				to_uid: message.to,
				from_uid: message.from,
				message_content: message.content,
				sent: message.sent
			});

			await manager.persistAndFlush(newMessage);
			return true;
		} catch (error) {
			throw new Error(`${error}`);
		}
	}
}