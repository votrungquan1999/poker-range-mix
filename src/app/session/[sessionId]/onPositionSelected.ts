"use server";

import action_refresh from "src/server/actions/action_refresh";
import { SessionCollectionName } from "src/server/collectionNames";
import { getMongoDb, injectMongoDB } from "src/server/mongodb/mongodb";
import type { PokerSessionDocument } from "src/server/types/PokerSession";
import withLogger from "src/server/withLogger";
import { flow } from "src/server/asynclocal";

const injectDependencies = flow(injectMongoDB, withLogger);

export default injectDependencies(async function onPositionSelected(
	handId: string,
	sessionId: string,
	position: "IP" | "OOP",
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
				"hands.$[hand].position": position,
				"hands.$[hand].playedAt": Date.now(),

				updatedAt: Date.now(),
			},
		},
		{
			arrayFilters: [{ "hand.id": handId }],
		},
	);

	await action_refresh();
});
