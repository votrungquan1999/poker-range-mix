"use server";

import action_refresh from "src/server/actions/action_refresh";
import { SessionCollectionName } from "src/server/collectionNames";
import { getMongoDb, injectMongoDB } from "src/server/mongodb/mongodb";
import type {
	PokerSessionDocument,
	StreetType,
} from "src/server/types/PokerSession";
import withLogger from "src/server/withLogger";
const streetOrder: StreetType[] = ["FLOP", "TURN", "RIVER"];

export default injectMongoDB(
	withLogger(async function handleNextStreet(
		handId: string,
		sessionId: string,
	) {
		const db = getMongoDb();

		const session = await db
			.collection<PokerSessionDocument>(SessionCollectionName)
			.findOne({
				id: sessionId,
			});

		if (!session) {
			throw new Error("Session not found");
		}

		const hand = session.hands.find((h) => h.id === handId);
		if (!hand) {
			throw new Error("Hand not found");
		}

		const currentStreet = hand.activeStreet ?? "FLOP";

		if (currentStreet === "RIVER") {
			throw new Error("Cannot advance past the river");
		}

		const nextStreet = streetOrder[streetOrder.indexOf(currentStreet) + 1];

		await db.collection<PokerSessionDocument>(SessionCollectionName).updateOne(
			{
				id: sessionId,
				"hands.id": handId,
			},
			{
				$set: {
					"hands.$.activeStreet": nextStreet,
					"hands.$.playedAt": Date.now(),

					updatedAt: Date.now(),
				},
			},
		);

		await action_refresh();
	}),
);
