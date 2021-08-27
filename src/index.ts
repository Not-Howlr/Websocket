import "dotenv/config";

import { Server } from "./Services/Server";

(async () => {
	try {
		await Server.Start();
	} catch (e) {
		throw Error(e);
	}
})();