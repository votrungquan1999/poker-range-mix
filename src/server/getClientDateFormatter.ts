import { cookies } from "next/headers";

export default function getClientDateFormatter() {
	const cookieStore = cookies();

	const timeZone = cookieStore.get("clientTimeZone");

	const dateFormatter = new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: timeZone?.value,
	});

	return dateFormatter;
}
