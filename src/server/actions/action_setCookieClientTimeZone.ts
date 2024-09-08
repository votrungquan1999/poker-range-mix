"use server";

import { cookies } from "next/headers";

export default async function action_setCookieClientTimeZone(timeZone: string) {
	const cookieStore = cookies();

	cookieStore.set("clientTimeZone", timeZone);
}
