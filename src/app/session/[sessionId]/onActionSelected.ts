"use server";

import action_refresh from "src/server/actions/action_refresh";
import { SessionCollectionName } from "src/server/collectionNames";
import { getMongoDb, injectMongoDB } from "src/server/mongodb/mongodb";
import type {
	ActionType,
	PokerSessionDocument,
	StreetType,
} from "src/server/types/PokerSession";
import withLogger from "src/server/withLogger";

export default injectMongoDB(
	withLogger(async function onActionSelected(
		street: StreetType,
		handId: string,
		sessionId: string,
		action: ActionType,
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

		const streetToUpdate =
			session.hands.find((h) => h.id === handId)?.streets[street] ?? {};

		streetToUpdate.action = action;

		await db.collection<PokerSessionDocument>(SessionCollectionName).updateOne(
			{ id: sessionId, "hands.id": handId },
			{
				$set: {
					[`hands.$.streets.${street}`]: streetToUpdate,
					"hands.$.playedAt": Date.now(),

					updatedAt: Date.now(),
				},
			},
		);

		await action_refresh();
	}),
);
