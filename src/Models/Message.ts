import { Entity, Index, Property } from "@mikro-orm/core";

import { Base } from "./Base";

@Entity()
export class Message extends Base {

	constructor(params: Partial<Message>) {
		super();
		Object.assign(this, params);
	}

	@Index()
	@Property()
	from_uid: string;

	@Index()
	@Property()
	to_uid: string;

	@Property()
	message_content: string;

	@Property({ type: Date, hidden: true })
	sent: Date = new Date();

	@Property({ type: Boolean, default: false, hidden: true })
	deleted = false;
}
