"use server";

import action_refresh from "src/server/actions/action_refresh";
import { SessionCollectionName } from "src/server/collectionNames";
import { getMongoDb, injectMongoDB } from "src/server/mongodb/mongodb";
import type {
	HandType,
	PokerSessionDocument,
	StreetType,
} from "src/server/types/PokerSession";

export default injectMongoDB(async function onHandStrengthSelected(
	street: StreetType,
	handId: string,
	sessionId: string,
	hand: HandType,
): Promise<void> {
	const db = getMongoDb();

	const session = await db
		.collection<PokerSessionDocument>(SessionCollectionName)
		.findOne({
			id: sessionId,
		});

	if (!session) {
		throw new Error("Session not found");
	}

	const streetToUpdate =
		session.hands.find((h) => h.id === handId)?.streets[street] ?? {};

	streetToUpdate.hand = hand;

	await db.collection<PokerSessionDocument>(SessionCollectionName).updateOne(
		{ id: sessionId, "hands.id": handId },
		{
			$set: {
				[`hands.$.streets.${street}`]: streetToUpdate,
			},
		},
	);

	await action_refresh();
});
