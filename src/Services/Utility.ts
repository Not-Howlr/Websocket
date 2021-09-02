export class Utility {

	public static CreateUuid(): string {
		let dt = new Date().getTime();
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			const r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}

	public static GetDiffInMs(now: Date, target: Date): number {
		const _now = new Date(now).getTime();
		const _target = new Date(target).getTime();
		return (_now - _target);
	}

	public static GetDiffInMin(now: Date, target: Date): number {
		const diff = Utility.GetDiffInMs(now, target);
		return Math.round(((diff % 86400000) % 3600000) / 60000);
	}
}