"use server";

import { SessionCollectionName } from "src/server/collectionNames";
import { getMongoDb, injectMongoDB } from "src/server/mongodb/mongodb";
import type { PokerSessionDocument } from "src/server/types/PokerSession";
import withLogger from "src/server/withLogger";
import { flow } from "src/server/asynclocal";

const injectDependencies = flow(injectMongoDB, withLogger);

export default injectDependencies(async function onSessionNameChanged(
	sessionId: string,
	newName: string,
): Promise<void> {
	const db = getMongoDb();

	const Session = db.collection<PokerSessionDocument>(SessionCollectionName);

	const session = await Session.findOne({ id: sessionId });

	if (!session) {
		return;
	}

	await Session.updateOne(
		{ id: sessionId },
		{
			$set: {
				name: newName,

				updatedAt: Date.now(),
			},
		},
	);
});
