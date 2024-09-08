"use server";

import { auth } from "src/auth";
import { getMongoDb, injectMongoDB } from "../mongodb/mongodb";
import { nanoid } from "nanoid";
import type { PokerSessionDocument } from "../types/PokerSession";
import { redirect } from "next/navigation";
import { SessionCollectionName } from "../collectionNames";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	dateStyle: "medium",
	timeStyle: "short",
});

export default injectMongoDB(async function createNewSession() {
	const loginSession = await auth();

	if (!loginSession || !loginSession.user) {
		throw new Error("User not authenticated");
	}

	const db = getMongoDb();

	const collection = db.collection<PokerSessionDocument>(SessionCollectionName);

	const id = nanoid();

	await collection.insertOne({
		createdBy: loginSession.user.email ?? "Anonymous",
		createdAt: Date.now(),
		id,

		hands: [
			{
				id: nanoid(),
				order: 1,
				playedAt: Date.now(),
				activeStreet: "FLOP",
				streets: {},
			},
		],
		// default name should have the time of creation
		name: `${dateFormatter.format(Date.now())}`,

		updatedAt: Date.now(),
	});

	redirect(`/session/${id}`);
});
