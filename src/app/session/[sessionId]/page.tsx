import { ArrowRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	dateStyle: "medium",
	timeStyle: "short",
});

const selectedPosition: string = "IP";
const selectedHand: string = "STR";
const selectedStreet: string = "FLOP";
const selectedAction = "Check";
const handHistory: Record<HandType, Record<ActionType, number>> = {
	WEAK: {
		Check: 2,
		"Check-Raise": 1,
		Bet: 1,
		"Re-Raise": 1,
		"All In": 0,
		Fold: 0,
	},
	MED: {
		Check: 2,
		"Check-Raise": 1,
		Bet: 1,
		"Re-Raise": 1,
		"All In": 0,
		Fold: 0,
	},
	STR: {
		Check: 2,
		"Check-Raise": 1,
		Bet: 1,
		"Re-Raise": 1,
		"All In": 0,
		Fold: 0,
	},
	NUT: {
		Check: 2,
		"Check-Raise": 1,
		Bet: 1,
		"Re-Raise": 1,
		"All In": 0,
		Fold: 0,
	},
};

type HandType = "WEAK" | "MED" | "STR" | "NUT";

export default async function Session() {
	return (
		<div className="flex flex-col divide-y divide-blue-200">
			<header className="flex flex-col gap-1 py-2 mt-4">
				<h1 className="text-2xl font-semibold flex flex-row gap-2 text-slate-800">
					Session:
					<input
						defaultValue="#Session Name Input here"
						className="w-full text-blue-600 hover:outline outline-2 rounded"
					/>
				</h1>

				<p className="text-slate-800">
					<span className="text-slate-500">Last played at: </span>

					{dateFormatter.format(Date.now())}
				</p>
			</header>

			<RecordHandSection />

			<div className="p-4 flex flex-col gap-4">
				<h2 className="text-2xl font-semibold text-slate-800">
					Session History:
				</h2>
				<div className="flex-col gap-4 flex">
					<HandHistorySection hand="WEAK" actionHistory={handHistory.WEAK} />
					<HandHistorySection hand="MED" actionHistory={handHistory.MED} />
					<HandHistorySection hand="STR" actionHistory={handHistory.STR} />
					<HandHistorySection hand="NUT" actionHistory={handHistory.NUT} />
				</div>
			</div>
		</div>
	);
}

function HandHistorySection({
	actionHistory,
	hand,
}: {
	hand: HandType;
	actionHistory: Record<ActionType, number>;
}) {
	const actions: ActionType[] = [
		"Check",
		"Check-Raise",
		"Bet",
		"Re-Raise",
		"All In",
		"Fold",
	];

	const titleCaseHand = hand
		.toLowerCase()
		.replace(/^\w/, (c) => c.toUpperCase());

	return (
		<div
			className={clsx("p-2 border rounded-lg shadow-md", {
				"border-red-600": hand === "WEAK",
				"border-amber-600": hand === "MED",
				"border-green-600": hand === "STR",
				"border-fuchsia-600": hand === "NUT",
			})}
		>
			<h2
				className={clsx("text-lg", {
					"text-red-600": hand === "WEAK",
					"text-amber-600": hand === "MED",
					"text-green-600": hand === "STR",
					"text-fuchsia-600": hand === "NUT",
				})}
			>
				Hand: {titleCaseHand}
			</h2>

			<div className="grid grid-cols-6 gap-2">
				{actions.map((action) => {
					const count = actionHistory[action] ?? 0;

					return (
						<div
							key={action}
							className="flex flex-col border border-slate-200 rounded items-center"
						>
							<h3 className="text-4xl text-slate-800">{count}</h3>

							<p className="text-slate-600 text-sm">{action}</p>
						</div>
					);

					// return (
					// 	<p key={action}>
					// 		{action}: {count}
					// 	</p>
					// );
				})}
			</div>
		</div>
	);
}

function RecordHandSection() {
	return (
		<div className="flex flex-col p-4">
			<div className="flex flex-row justify-between">
				<h2 className="text-2xl font-semibold text-slate-800">Hand #1</h2>

				<button
					type="button"
					className="px-2 py-1 border rounded border-blue-100 text-blue-600 hover:text-white hover:bg-blue-600"
				>
					Next Hand
				</button>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex flex-col">
					<h2 className="text-lg font-semibold">Position</h2>

					<div className="flex flex-row gap-6">
						<HandButton
							section="Position"
							value="IP"
							selectedValue={selectedPosition}
						/>

						<HandButton
							section="Position"
							value="OOP"
							selectedValue={selectedPosition}
						/>
					</div>
				</div>

				<div className="flex flex-col">
					<h2 className="text-lg font-semibold">Hand</h2>

					<div className="flex flex-row gap-6">
						<HandButton
							section="Hand"
							value="WEAK"
							selectedValue={selectedHand}
						/>

						<HandButton
							section="Hand"
							value="MED"
							selectedValue={selectedHand}
						/>

						<HandButton
							section="Hand"
							value="STR"
							selectedValue={selectedHand}
						/>

						<HandButton
							section="Hand"
							value="NUT"
							selectedValue={selectedHand}
						/>
					</div>
				</div>

				<div className="flex flex-col">
					<h2 className="text-lg font-semibold">Street</h2>

					<div className="flex flex-row justify-between pr-4">
						<div className="flex flex-row gap-6 w-full">
							<HandButton
								section="Street"
								value="PRE"
								selectedValue={selectedStreet}
							/>

							<HandButton
								section="Street"
								value="FLOP"
								selectedValue={selectedStreet}
							/>

							<HandButton
								section="Street"
								value="TURN"
								selectedValue={selectedStreet}
							/>

							<HandButton
								section="Street"
								value="RIVER"
								selectedValue={selectedStreet}
							/>
						</div>

						<button
							type="button"
							className="flex flex-row gap-2 items-center underline text-blue-600 text-lg whitespace-nowrap"
						>
							Next Street
							<ArrowRightIcon className="w-6 h-6" />
						</button>
					</div>
				</div>

				<div className="flex flex-col">
					<h2 className="text-lg font-semibold">Actions</h2>

					<div className="flex flex-row flex-wrap gap-6">
						<ActionButton action="Check" selectedAction={selectedAction} />

						<ActionButton
							action="Check-Raise"
							selectedAction={selectedAction}
						/>

						<ActionButton action="Bet" selectedAction={selectedAction} />

						<ActionButton action="Re-Raise" selectedAction={selectedAction} />

						<ActionButton action="All In" selectedAction={selectedAction} />

						<ActionButton action="Fold" selectedAction={selectedAction} />
					</div>
				</div>
			</div>
		</div>
	);
}

type ActionType =
	| "Check"
	| "Check-Raise"
	| "Bet"
	| "Re-Raise"
	| "All In"
	| "Fold";
function ActionButton({
	action,
	selectedAction,
}: { action: ActionType; selectedAction: ActionType }) {
	return (
		<button
			type="button"
			className={clsx(
				"text-xl px-2 py-1 rounded-lg cursor-pointer whitespace-nowrap border border-amber-600 shadow outline-amber-600",
				{
					"bg-amber-600 text-white": selectedAction === action,
					"bg-white text-amber-600": selectedAction !== action,
				},
			)}
		>
			{action}
		</button>
	);
}

function HandButton({
	section,
	value,
	selectedValue,
}: {
	section: "Position" | "Hand" | "Street";
	value: string;
	selectedValue: string;
}) {
	return (
		<button
			type="button"
			className={clsx(
				"text-xl px-2 py-1 rounded cursor-pointer border border-blue-600 shadow outline-blue-600",
				{
					"bg-blue-600 text-white": selectedValue === value,
					"bg-white text-blue-600": selectedValue !== value,
				},
			)}
		>
			{value}
		</button>
	);
}
