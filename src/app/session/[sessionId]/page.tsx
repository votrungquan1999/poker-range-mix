import { ArrowRightIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { HomeIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SessionCollectionName } from "src/server/collectionNames";
import { getMongoDb, injectMongoDB } from "src/server/mongodb/mongodb";
import type {
	ActionType,
	HandType,
	PokerHand,
	PokerSessionDocument,
} from "src/server/types/PokerSession";
import onActionSelected from "./onActionSelected";
import onHandStrengthSelected from "./onHandStrengthSelected";
import onPositionSelected from "./onPositionSelected";
import handleNextStreet from "./handleNextStreet";
import handleNewHand from "./handleNewHand";
import SessionNameInput from "./SessionNameInput";

export async function generateMetadata({
	params,
}: { params: { sessionId: string } }): Promise<Metadata> {
	const session = await getSessionById(params.sessionId);

	if (!session) {
		notFound();
	}

	return {
		title: `PRM - ${session.name}`,
	};
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	dateStyle: "medium",
	timeStyle: "short",
});

const getSessionById = injectMongoDB(async function getSessionById(
	sessionId: string,
) {
	const db = getMongoDb();

	const collection = db.collection<PokerSessionDocument>(SessionCollectionName);

	const session = await collection.findOne({ id: sessionId });

	return session;
});

export default async function Session({
	params,
}: { params: { sessionId: string } }) {
	const session = await getSessionById(params.sessionId);

	if (!session) {
		notFound();
	}

	const lastHand = session.hands[session.hands.length - 1];

	return (
		<div className="flex flex-col divide-y divide-blue-200">
			<header className="py-2 mt-4">
				<h1 className="text-2xl font-semibold flex flex-row gap-2 text-slate-800 whitespace-nowrap items-center">
					<Link
						href="/"
						className="hover:underline hover:bg-blue-50 hover:text-blue-600 focus:underline focus:bg-blue-50 focus:text-blue-600 px-2 py-1 cursor-pointer rounded flex flex-row gap-2 items-center"
					>
						<HomeIcon className="w-6 h-6" />
						PRM
					</Link>

					<ChevronRightIcon className="w-8 h-8" />

					<SessionNameInput
						sessionId={params.sessionId}
						sessionName={session.name}
					/>
				</h1>

				<p className="text-slate-800 px-2">
					<span className="text-slate-500">Last played at: </span>

					{dateFormatter.format(Date.now())}
				</p>
			</header>

			<RecordHandSection hand={lastHand} sessionId={params.sessionId} />

			<div className="p-4 flex flex-col gap-4">
				<h2 className="text-2xl font-semibold text-slate-800">
					Session History:
				</h2>

				<HandHistorySection sessionId={params.sessionId} />
			</div>
		</div>
	);
}

type ActionHistory = {
	[key in HandType]: Record<ActionType, number>;
};

const getActionHistory = injectMongoDB(async function getActionHistory(
	sessionId: string,
): Promise<ActionHistory> {
	const db = getMongoDb();

	const collection = db.collection<PokerSessionDocument>(SessionCollectionName);

	const session = await collection.findOne({ id: sessionId });

	if (!session) {
		throw new Error("Session not found");
	}

	const actionHistory: ActionHistory = {
		WEAK: getActionsByHandStrength(session.hands, "WEAK"),
		MED: getActionsByHandStrength(session.hands, "MED"),
		STR: getActionsByHandStrength(session.hands, "STR"),
		DRAW: getActionsByHandStrength(session.hands, "DRAW"),
		NUT: getActionsByHandStrength(session.hands, "NUT"),
	};

	return actionHistory;
});

function getActionsByHandStrength(
	hands: PokerHand[],
	handStrength: HandType,
): Record<ActionType, number> {
	const actionHistory = hands.reduce(
		(acc, hand) => {
			if (hand.streets.FLOP?.hand === handStrength) {
				acc[hand.streets.FLOP.action ?? "Check"]++;
			}
			if (hand.streets.TURN?.hand === handStrength) {
				acc[hand.streets.TURN.action ?? "Check"]++;
			}
			if (hand.streets.RIVER?.hand === handStrength) {
				acc[hand.streets.RIVER.action ?? "Check"]++;
			}

			return acc;
		},
		{
			Check: 0,
			"Check-Raise": 0,
			Bet: 0,
			"Re-Raise": 0,
			"All In": 0,
			Fold: 0,
		},
	);

	return actionHistory;
}

async function HandHistorySection({
	sessionId,
	// hand,
}: {
	sessionId: string;
	// hand: HandType;
	// actionHistory: Record<ActionType, number>;
}) {
	const actions: ActionType[] = [
		"Check",
		"Check-Raise",
		"Bet",
		"Re-Raise",
		"All In",
		"Fold",
	];

	const hands: HandType[] = ["WEAK", "MED", "STR", "DRAW", "NUT"];

	const actionHistory = await getActionHistory(sessionId);

	return (
		<div className="flex-col gap-4 flex">
			{hands.map((hand) => {
				const titleCaseHand = hand
					.toLowerCase()
					.replace(/^\w/, (c) => c.toUpperCase());

				const strengthActions = actionHistory[hand];

				return (
					<div
						key={hand}
						className={clsx("p-2 border rounded-lg shadow-md", {
							"border-red-600": hand === "WEAK",
							"border-amber-600": hand === "MED",
							"border-green-600": hand === "STR",
							"border-slate-400": hand === "DRAW",
							"border-fuchsia-600": hand === "NUT",
						})}
					>
						<h2
							className={clsx("text-lg", {
								"text-red-600": hand === "WEAK",
								"text-amber-600": hand === "MED",
								"text-green-600": hand === "STR",
								"text-slate-400": hand === "DRAW",
								"text-fuchsia-600": hand === "NUT",
							})}
						>
							{titleCaseHand}
						</h2>

						<div className="grid grid-cols-6 gap-2">
							{actions.map((action) => {
								const count = strengthActions[action] ?? 0;

								return (
									<div
										key={action}
										className="flex flex-col border border-slate-200 rounded items-center"
									>
										<h3 className="text-4xl text-slate-800">{count}</h3>

										<p className="text-slate-600 text-sm">{action}</p>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</div>
	);
}

function RecordHandSection({
	hand,
	sessionId,
}: { hand: PokerHand; sessionId: string }) {
	// currentStreet is the last street that has an action or hand recorded
	const currentStreet = hand.activeStreet ?? "FLOP";

	const selectedHand = hand.streets[currentStreet]?.hand;

	const selectedAction = hand.streets[currentStreet]?.action;

	const bindedOnPositionSelected = onPositionSelected.bind(
		null,
		hand.id,
		sessionId,
	);
	const bindedOnHandStrengthSelected = onHandStrengthSelected.bind(
		null,
		currentStreet,
		hand.id,
		sessionId,
	);
	const bindedOnActionSelected = onActionSelected.bind(
		null,
		currentStreet,
		hand.id,
		sessionId,
	);

	const bindedHandleNextStreet = handleNextStreet.bind(
		null,
		hand.id,
		sessionId,
	);

	const bindedHandleNewHand = handleNewHand.bind(null, sessionId);

	return (
		<div className="flex flex-col p-4">
			<div className="flex flex-row justify-between">
				<h2 className="text-2xl font-semibold text-slate-800">
					Hand #{hand.order}
				</h2>

				<form action={bindedHandleNewHand}>
					<button
						type="submit"
						className="px-2 py-1 border rounded border-blue-100 text-blue-600 hover:text-white hover:bg-blue-600"
					>
						Next Hand
					</button>
				</form>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex flex-col">
					<h2 className="text-lg font-semibold">Position</h2>

					<div className="flex flex-row gap-6">
						<HandButton
							value="IP"
							selectedValue={hand.position}
							action={bindedOnPositionSelected}
						/>

						<HandButton
							value="OOP"
							selectedValue={hand.position}
							action={bindedOnPositionSelected}
						/>
					</div>
				</div>

				<div className="flex flex-col">
					<h2 className="text-lg font-semibold">Street</h2>

					<div className="flex flex-row gap-10 pr-4 items-center">
						<p className="text-xl px-2 py-1 rounded border border-blue-600 shadow outline-blue-600 text-blue-600">
							{currentStreet}
						</p>

						<form action={bindedHandleNextStreet}>
							<button
								type={currentStreet === "RIVER" ? "button" : "submit"}
								className={clsx(
									"flex flex-row gap-2 items-center underline text-blue-600 text-lg whitespace-nowrap hover:outline outline-blue-400 rounded outline-2 px-2",
									{
										"opacity-50": currentStreet === "RIVER",
									},
								)}
							>
								Next Street
								<ArrowRightIcon className="w-6 h-6" />
							</button>
						</form>
					</div>
				</div>

				<div className="flex flex-col">
					<h2 className="text-lg font-semibold">Hand</h2>

					<div className="flex flex-row gap-6">
						<HandButton
							value="WEAK"
							selectedValue={selectedHand}
							action={bindedOnHandStrengthSelected}
						/>

						<HandButton
							value="MED"
							selectedValue={selectedHand}
							action={bindedOnHandStrengthSelected}
						/>

						<HandButton
							value="STR"
							selectedValue={selectedHand}
							action={bindedOnHandStrengthSelected}
						/>

						<HandButton
							value="DRAW"
							selectedValue={selectedHand}
							action={bindedOnHandStrengthSelected}
						/>

						<HandButton
							value="NUT"
							selectedValue={selectedHand}
							action={bindedOnHandStrengthSelected}
						/>
					</div>
				</div>

				<div className="flex flex-col">
					<h2 className="text-lg font-semibold">Actions</h2>

					<div className="flex flex-row flex-wrap gap-6">
						<ActionButton
							action="Check"
							selectedAction={selectedAction}
							onClick={bindedOnActionSelected}
						/>

						<ActionButton
							action="Check-Raise"
							selectedAction={selectedAction}
							onClick={bindedOnActionSelected}
						/>

						<ActionButton
							action="Bet"
							selectedAction={selectedAction}
							onClick={bindedOnActionSelected}
						/>

						<ActionButton
							action="Re-Raise"
							selectedAction={selectedAction}
							onClick={bindedOnActionSelected}
						/>

						<ActionButton
							action="All In"
							selectedAction={selectedAction}
							onClick={bindedOnActionSelected}
						/>

						<ActionButton
							action="Fold"
							selectedAction={selectedAction}
							onClick={bindedOnActionSelected}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function ActionButton({
	action,
	selectedAction,
	onClick,
}: {
	action: ActionType;
	selectedAction: ActionType | undefined;
	onClick: (value: ActionType) => Promise<void>;
}) {
	return (
		<form
			action={async () => {
				"use server";

				await onClick(action);
			}}
		>
			<button
				type="submit"
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
		</form>
	);
}

function HandButton({
	value,
	selectedValue,
	action,
}: {
	value: string;
	selectedValue?: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	action: (value: any) => Promise<void>;
}) {
	return (
		<form
			action={async () => {
				"use server";

				await action(value);
			}}
		>
			<button
				type="submit"
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
		</form>
	);
}
