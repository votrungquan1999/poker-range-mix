import UserAccount from "src/components/UserAccount";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { ArrowPathIcon, HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import clsx from "clsx";
import { revalidatePath } from "next/cache";
import SubmitButton from "src/components/SubmitButton";
import { cookies } from "next/headers";
import SwitchComponent from "src/components/radix/switch";
import ShowResultOnClickSection from "./ShowResultOnClickSection";
import { nanoid } from "nanoid";

export type Result = {
	numerator: number;
	denominator: number;
	matched: boolean;
};

export default function Randomizer() {
	const cookieStore = cookies();

	const showResultOnClickCookie = cookieStore.get("showResultOnClick");

	const showResultOnClick = showResultOnClickCookie
		? showResultOnClickCookie.value === "true"
		: true;

	// results of randomize 1/2 chance to 1/9 chance
	const results: Result[] = Array.from({ length: 8 }, (_, i) => {
		const numerator = 1;
		const denominator = i + 2;

		const randomNumber = Math.floor(Math.random() * denominator) + 1;

		return {
			numerator,
			denominator,
			matched: randomNumber === denominator,
		};
	});

	const randomizeId = nanoid();

	return (
		<div className="flex flex-col divide-y divide-blue-200">
			<header className="py-2 mt-4 flex flex-row justify-between">
				<div>
					<h1 className="text-2xl font-semibold flex flex-row gap-2 text-slate-800 whitespace-nowrap items-center">
						<Link
							href="/"
							className="hover:underline hover:bg-blue-50 hover:text-blue-600 focus:underline focus:bg-blue-50 focus:text-blue-600 px-2 py-1 cursor-pointer rounded flex flex-row gap-2 items-center"
						>
							<HomeIcon className="w-6 h-6" />
							PRM
						</Link>

						<ChevronRightIcon className="w-8 h-8" />

						<p>Randomizer</p>
					</h1>
				</div>

				<UserAccount />
			</header>

			<div className="p-4">
				<div className="flex flex-row gap-4 items-center justify-between p-2">
					<form
						action={async () => {
							"use server";

							revalidatePath("/");
						}}
					>
						<SubmitButton
							pendingButton={
								<button type="button">
									<ArrowPathIcon className="w-6 h-6 text-blue-600 animate-spin cursor-not-allowed" />
								</button>
							}
						>
							<div className="flex flex-row gap-2 items-center">
								<button type="submit" id="randomizer-refresh">
									<ArrowPathIcon className="w-6 h-6 text-blue-600" />
								</button>
								<label htmlFor="randomizer-refresh">Refresh</label>
							</div>
						</SubmitButton>
					</form>

					<form
						action={async () => {
							"use server";

							const cookieStore = cookies();

							if (showResultOnClick) {
								cookieStore.set("showResultOnClick", "false");
							} else {
								cookieStore.set("showResultOnClick", "true");
							}

							revalidatePath("/");
						}}
					>
						<SwitchComponent
							checked={showResultOnClick}
							submitOnChange
							labelNode={<p className="text-slate-600">Show result on click</p>}
						/>
					</form>
				</div>

				{!showResultOnClick && <ShowAllResults results={results} />}

				{showResultOnClick && (
					<ShowResultOnClickSection results={results} key={randomizeId} />
				)}
			</div>
		</div>
	);
}

function ShowAllResults({ results }: { results: Result[] }) {
	return (
		<div className="grid grid-cols-2 gap-4 place-items-center">
			{results.map((result) => (
				<RandomizerCard key={result.denominator} {...result} />
			))}
		</div>
	);
}

function RandomizerCard({
	denominator,
	numerator,
	matched,
}: {
	denominator: number;
	numerator: number;
	matched: boolean;
}) {
	return (
		<div
			className={clsx(
				"flex flex-col w-24 gap-1 border border-blue-200 rounded-lg px-4 py-2 items-center",
				matched ? "bg-green-200" : "bg-red-200",
			)}
		>
			<p className="text-2xl text-slate-600">{numerator}</p>

			<hr className="w-full border-t border-blue-200" />

			<p className="text-2xl text-blue-600">{denominator}</p>
		</div>
	);
}
