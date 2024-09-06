"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useFormStatus } from "react-dom";
import action_refresh from "src/server/actions/action_refresh";

export default function RefreshButton() {
	return (
		<form action={action_refresh}>
			<WithPendingRefreshButton />
		</form>
	);
}

function WithPendingRefreshButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			className="flex flex-row items-center gap-2 text-blue-500 underline"
		>
			{pending ? "Refreshing…" : "Refresh"}
			<ArrowPathIcon
				className={clsx("h-4 w-4", {
					"animate-spin": pending,
				})}
			/>
		</button>
	);
}
