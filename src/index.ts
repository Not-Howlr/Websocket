import "dotenv/config";

import { Handler } from "./Services/Handler";

(async () => {
	try {
		await Handler.Init();
	} catch (e) {
		throw Error(`${e}`);
	}
})();