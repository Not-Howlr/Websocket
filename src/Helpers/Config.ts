export class Config {

	public static readonly Options = {
		PORT: <number>parseInt(process.env.PORT as string) || 3000,
		DOMAIN: <string>process.env.DOMAIN
	}
}