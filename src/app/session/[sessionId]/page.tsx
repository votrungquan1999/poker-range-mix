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

export default async function Session() {
	return (
		<div>
			<header className="flex flex-col gap-1 py-2 border-b border-blue-100 mt-4 ">
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

			<div className="flex flex-col gap-4 mt-4">
				<div className="flex flex-row justify-between">
					<h2 className="text-2xl font-semibold text-slate-800">Hand #1</h2>

					<button
						type="button"
						className="px-2 py-1 border rounded border-blue-100 text-blue-600 hover:text-white hover:bg-blue-600"
					>
						Next Hand
					</button>
				</div>

				<div className="flex flex-col gap-2">
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

				<div className="flex flex-col gap-2">
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

				<div className="flex flex-col gap-2">
					<h2 className="text-lg font-semibold">Street</h2>

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

						<button
							type="button"
							className="flex flex-row gap-2 items-center px-2 text-blue-600 py-1 rounded cursor-pointer border border-blue-600 shadow outline-blue-600 text to-blue-600"
						>
							Next Street
							<ArrowRightIcon className="w-6 h-6" />
						</button>
					</div>
				</div>

				<div className="flex flex-col gap-2">
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
