"use client";

import clsx from "clsx";
import { useState } from "react";
import type { Result } from "./page";

export default function ShowResultOnClickSection({
	results,
}: {
	results: Result[];
}) {
	return (
		<div className="grid grid-cols-2 gap-4 place-items-center">
			{results.map((result) => (
				<RandomizerCard key={result.denominator} {...result} />
			))}
		</div>
	);
}

function RandomizerCard({ numerator, denominator, matched }: Result) {
	const [showResult, setShowResult] = useState(false);

	return (
		<button
			type="button"
			onClick={() => setShowResult(true)}
			className={clsx(
				"flex flex-col w-24 gap-1 border border-blue-200 rounded-lg px-4 py-2 items-center",
				{
					"bg-green-200": matched && showResult,
					"bg-red-200": !matched && showResult,
					"bg-slate-200": !showResult,
				},
			)}
		>
			<p className="text-2xl text-slate-600">{numerator}</p>

			<hr className="w-full border-t border-blue-200" />

			<p className="text-2xl text-blue-600">{denominator}</p>
		</button>
	);
}
