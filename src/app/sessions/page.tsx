import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { HomeIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Link from "next/link";
import { SessionCollectionName } from "src/server/collectionNames";
import { getMongoDb, injectMongoDB } from "src/server/mongodb/mongodb";
import type { PokerSessionDocument } from "src/server/types/PokerSession";
import RefreshButton from "src/components/RefreshButton";
import createNewSession from "src/server/actions/createNewSession";
import RelativeTime from "src/components/RelativeTime";
import Pagination from "src/components/Pagination";
import { auth } from "src/auth";
import getClientDateFormatter from "src/server/getClientDateFormatter";
import UserAccount from "src/components/UserAccount";
import withLogger from "src/server/withLogger";
import { flow } from "src/server/asynclocal";

export const metadata: Metadata = {
	title: "Poker Range Mixing - All Sessions",
};

const injectDependencies = flow(injectMongoDB, withLogger);

const getAllSessions = injectDependencies(async function getAllSessions(
	userId: string,
	currentPage: number,
) {
	const db = getMongoDb();

	const limit = 10;
	const skip = (currentPage - 1) * limit;

	const sessions = await db
		.collection<PokerSessionDocument>(SessionCollectionName)
		.find({
			createdBy: userId,
		})
		.sort({ updatedAt: -1 })
		.skip(skip)
		.limit(limit)
		.toArray();

	const sessionCount = await db
		.collection<PokerSessionDocument>(SessionCollectionName)
		.countDocuments();

	return {
		sessions,
		sessionCount,
	};
});

export default async function SessionsPage({
	searchParams,
}: {
	searchParams: {
		currentPage?: number;
	};
}) {
	const currentPage = searchParams.currentPage || 1;

	const logInSession = await auth();

	if (!logInSession) {
		return null;
	}

	const { sessions, sessionCount } = await getAllSessions(
		logInSession.user.email,
		currentPage,
	);

	const serverNow = Date.now();

	const pages = Math.ceil(sessionCount / 10);

	return (
		<div className="flex flex-col divide-y divide-blue-200 flex-1">
			<header className="py-2 mt-4 flex flex-row justify-between items-center">
				<h1 className="text-2xl font-semibold flex flex-row gap-2 text-slate-800 whitespace-nowrap items-center">
					<Link
						href="/"
						className="hover:underline hover:bg-blue-50 hover:text-blue-600 focus:underline focus:bg-blue-50 focus:text-blue-600 px-2 py-1 cursor-pointer rounded flex flex-row gap-2 items-center"
					>
						<HomeIcon className="w-6 h-6" />
						PRM
					</Link>

					<ChevronRightIcon className="w-8 h-8" />

					<p>All Sessions</p>
				</h1>

				<UserAccount />
			</header>

			<div className="p-2 flex flex-col gap-4">
				<div className="flex flex-row justify-between items-center mt-4">
					<div className="flex flex-row gap-2">
						<p className="text-slate-600">
							Updated <RelativeTime from={serverNow} />
						</p>
						<RefreshButton />
					</div>

					<form action={createNewSession}>
						<button
							type="submit"
							className="px-2 py-1 text-lg text-blue-600 rounded border border-blue-600 hover:bg-blue-100"
						>
							Start new Session
						</button>
					</form>
				</div>

				<SessionsDisplay sessions={sessions} />

				<Pagination currentPage={currentPage} pages={pages} />
			</div>
		</div>
	);
}

function SessionsDisplay({
	sessions,
}: {
	sessions: PokerSessionDocument[];
}) {
	if (sessions.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-48 gap-4 bg-slate-100 rounded-lg">
				<h3 className="text-2xl text-slate-800 font-semibold">
					No sessions found
				</h3>

				<form action={createNewSession}>
					<button
						type="submit"
						className="px-4 py-2 text-lg font-semibold bg-blue-600 rounded text-white"
					>
						Start new Session
					</button>
				</form>
			</div>
		);
	}

	const dateFormatter = getClientDateFormatter();

	return (
		<div className="flex flex-col gap-2">
			{sessions.map((session) => (
				<Link
					href={`/session/${session.id}`}
					key={session.id}
					className="flex flex-row justify-between p-2 border border-blue-200 rounded shadow hover:bg-blue-50 cursor-pointer"
				>
					<div className="flex flex-col">
						<h2 className="text-2xl text-blue-600 font-semibold">
							{session.name}
						</h2>

						<p className="text-slate-800">
							<span className="text-slate-500">Last played at: </span>

							{dateFormatter.format(session.updatedAt)}
						</p>
					</div>

					<div className="flex flex-col items-center">
						<p className="text-3xl font-semibold text-slate-800">
							{session.hands.length}
						</p>

						<p className="text-sm text-slate-600">Hands</p>
					</div>
				</Link>
			))}
		</div>
	);
}
