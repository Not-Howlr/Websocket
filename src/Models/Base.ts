import { BeforeCreate, Index, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "mongodb";

import { Utility } from "../Services/Utility";

export abstract class Base {

	@PrimaryKey({ hidden: true })
	id: ObjectId;

	@Index()
	@Property({ type: String })
	uid!: string;

	@Property({ type: Boolean, default: false, hidden: true })
	deleted = false;

	@BeforeCreate()
	public CreateUid(): void {
		this.uid = Utility.CreateUuid();
	}
}
