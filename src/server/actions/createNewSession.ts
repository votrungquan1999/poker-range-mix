"use server";

import { auth } from "src/auth";
import { getMongoDb, injectMongoDB } from "../mongodb/mongodb";
import { nanoid } from "nanoid";
import type { PokerSessionDocument } from "../types/PokerSession";
import { redirect } from "next/navigation";
import { SessionCollectionName } from "../collectionNames";
import { cookies } from "next/headers";

export default injectMongoDB(async function createNewSession() {
	const loginSession = await auth();

	const cookieStore = cookies();

	if (!loginSession || !loginSession.user) {
		throw new Error("User not authenticated");
	}

	const db = getMongoDb();

	const collection = db.collection<PokerSessionDocument>(SessionCollectionName);

	const id = nanoid();

	const timeZone = cookieStore.get("clientTimeZone");

	const dateFormatter = new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: timeZone?.value,
	});

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
