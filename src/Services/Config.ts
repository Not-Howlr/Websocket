export class Config {

	public static readonly Options = {
		HOST: <string>process.env.HOST || "127.0.0.1",
		PORT: <number>parseInt(process.env.PORT as string) || 3000,
		NODE_ENV: <string>process.env.NODE_ENV || "development",
		IS_PROD: <boolean>(process.env.NODE_ENV == "production" ? true : false)
	}

	public static readonly Secrets = {
		PUBLIC_KEY: <string>process.env.PUBLIC_KEY?.replace(/_NEWLINE_/g, "\n"),
		PRIVATE_KEY: <string>process.env.PRIVATE_KEY?.replace(/_NEWLINE_/g, "\n"),
		ENCRYPTION_KEY: <Buffer>Buffer.from(process.env.ENCRYPTION_KEY as string),
		ENCRYPTION_IV: <Buffer>Buffer.from(process.env.ENCRYPTION_IV as string)
	}

	public static readonly Db = {
		DB_TYPE: <string>process.env.DB_TYPE,
		DB_URL: <string>process.env.DB_URL,
	}

}