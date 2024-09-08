"use client";

import { useEffect } from "react";
import action_setCookieClientTimeZone from "src/server/actions/action_setCookieClientTimeZone";

export default function TrackClientTimeZone() {
	useEffect(() => {
		const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		action_setCookieClientTimeZone(timeZone);
	}, []);

	return null;
}
