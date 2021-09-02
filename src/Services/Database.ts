import path from "path";
import { cwd } from "process";
import { MikroORM, ConnectionOptions } from "@mikro-orm/core";

import { Config } from "./Config";
import { MongoDriver, MongoEntityManager } from "@mikro-orm/mongodb";

export class Database {

	public static orm: MikroORM<MongoDriver>;

	/**
	 *
	 * An extension of the `orm.em` property from mikroorm
	 * ____
	 * @static
	 * @type {MongoEntityManager<MongoDriver>}
	 * @memberof Database
	 */
	public static Manager: MongoEntityManager<MongoDriver>

	private static readonly Connector: ConnectionOptions = {
		// debug: !Config.Options.IS_PROD,
		debug: false,
		type: Config.Db.DB_TYPE,
		clientUrl: Config.Db.DB_URL,
		implicitTransactions: true,
		ensureIndexes: true,
		entities: [path.join(cwd(), "build/Models/**/*.js")],
		entitiesTs: [path.join(cwd(), "src/Models/**/*.ts")],
		cache: {
			enabled: true,
			pretty: !Config.Options.IS_PROD,
			options: { cacheDir: cwd() + "/__db_cache__" }
		}
	} as ConnectionOptions;

	public static async Connect(): Promise<void> {
		try {
			Database.orm = await MikroORM.init<MongoDriver>(Database.Connector);
			await Database.orm.em.getDriver().createCollections();
			Database.Manager = Database.orm.em.fork();
		} catch (e) {
			throw new Error(`error connecting to database: ${e}`);
		}
	}

	public static async GetStatus(): Promise<boolean> {
		try {
			const connection = await Database.orm.isConnected();
			return connection;
		} catch (e) {
			throw new Error(`${e}`);
		}
	}

	public static async Close(): Promise<void> {
		try {
			return await Database.orm.close();
		} catch (e) {
			throw new Error(`${e}`);
		}
	}
}