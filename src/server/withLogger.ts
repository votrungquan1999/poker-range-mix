import setup from "./asynclocal";

// biome-ignore lint/suspicious/noExplicitAny: as the name suggests, this is a type for any async function
type AnyAsyncFunction = (...args: any[]) => Promise<any>;

// a with logger function, takes an async function
// it logs the start, end, and duration of the function and its name
// the log block should look like this:
// ```
// fnName called
// | ${timestamp} | start
// | ${timestamp} | any logs from the function
// | ${timestamp} | end
// | ${timestamp} | duration
// empty line
// ```
export default function withLogger<T extends AnyAsyncFunction>(
	fn: T,
	name?: string,
) {
	return asyncLocal.inject(
		async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
			const start = Date.now();

			const result = await fn(...args);

			const logger = asyncLocal.get();
			const logs = logger.getLogs();

			const fnName = name ?? fn.name;

			console.log(`${fnName} called`);
			console.log(`| ${start} | start`);

			for (const log of logs) {
				console.log(`| ${log.timestamp} | ${log.message}`);
			}

			const end = Date.now();
			console.log(`| ${end} | end`);
			console.log(`| ${end - start} | duration`);
			return result;
		},
	);
}

const asyncLocal = setup(createLogger);

type Log = {
	timestamp: number;
	message: string;
};

// create a logger that can be injected into the function using async local storage
// when logging, it should log the message with the timestamp, and the message
async function createLogger() {
	const logs: Log[] = [];

	const logger = {
		log: (message: string) => {
			logs.push({ timestamp: Date.now(), message });
		},
		getLogs: () => logs,
	};

	return logger;
}
