"use server";

import { nanoid } from "nanoid";
import action_refresh from "src/server/actions/action_refresh";
import { SessionCollectionName } from "src/server/collectionNames";
import { getMongoDb, injectMongoDB } from "src/server/mongodb/mongodb";
import type { PokerSessionDocument } from "src/server/types/PokerSession";

export default injectMongoDB(async function handleNewHand(sessionId: string) {
	const db = getMongoDb();

	const session = await db
		.collection<PokerSessionDocument>(SessionCollectionName)
		.findOne({
			id: sessionId,
		});

	if (!session) {
		throw new Error("Session not found");
	}

	const newId = nanoid();

	await db.collection<PokerSessionDocument>(SessionCollectionName).updateOne(
		{
			id: sessionId,
		},
		{
			$push: {
				hands: {
					id: newId,
					order: session.hands.length + 1,
					playedAt: Date.now(),
					activeStreet: "FLOP",
					streets: {},
				},
			},
		},
	);

	await action_refresh();
});
