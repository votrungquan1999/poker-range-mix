const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
	numeric: "auto",
});

// negative duration means in the past
// positive duration means in the future
export default function formatRelativeTime(duration: number): string {
	const seconds = Math.round(duration / 1000);
	const minutes = Math.round(seconds / 60);
	const hours = Math.round(minutes / 60);
	const days = Math.round(hours / 24);
	const weeks = Math.round(days / 7);
	const months = Math.round(days / 30);
	const years = Math.round(days / 365);

	if (Math.abs(seconds) < 45) {
		return "just now";
	}

	if (Math.abs(minutes) < 45) {
		return relativeTimeFormatter.format(minutes, "minute");
	}

	if (Math.abs(hours) < 22) {
		return relativeTimeFormatter.format(hours, "hour");
	}

	if (Math.abs(days) < 26) {
		return relativeTimeFormatter.format(days, "day");
	}

	if (Math.abs(weeks) < 11) {
		return relativeTimeFormatter.format(weeks, "week");
	}

	if (Math.abs(months) < 13) {
		return relativeTimeFormatter.format(months, "month");
	}

	return relativeTimeFormatter.format(years, "year");
}
