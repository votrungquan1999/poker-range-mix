"use client";

import { useEffect, useState } from "react";
import formatRelativeTime from "src/server/time/formatRelativeTime";

export default function RelativeTime({ from }: { from: number }) {
	const now = useNow();

	const diff = from - now;

	return <span suppressHydrationWarning>{formatRelativeTime(diff)}</span>;
}

function useNow() {
	const [now, setNow] = useState(Date.now());

	useEffect(() => {
		let id: number;
		let cancelled = false;

		function updateNow() {
			if (cancelled) return;
			setNow(Date.now());
			id = requestAnimationFrame(updateNow);
		}

		id = requestAnimationFrame(updateNow);

		return () => {
			cancelled = true;
			cancelAnimationFrame(id);
		};
	}, []);

	return now;
}
