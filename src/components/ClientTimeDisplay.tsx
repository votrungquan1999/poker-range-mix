"use client";

export default function ClientTimeDisplay({
	time,
}: {
	time: number;
}) {
	const dateFormatter = new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	});

	return <span suppressHydrationWarning>{dateFormatter.format(time)}</span>;
}
