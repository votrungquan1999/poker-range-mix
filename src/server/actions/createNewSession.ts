"use server";

import { auth } from "src/auth";
import { getMongoDb, injectMongoDB } from "../mongodb/mongodb";
import { nanoid } from "nanoid";
import type { PokerSessionDocument } from "../types/PokerSession";
import { redirect } from "next/navigation";

export default injectMongoDB(async function createNewSession() {
	const loginSession = await auth();

	if (!loginSession || !loginSession.user) {
		throw new Error("User not authenticated");
	}

	const db = getMongoDb();

	const collection = db.collection<PokerSessionDocument>("sessions");

	const id = nanoid();

	await collection.insertOne({
		createdBy: loginSession.user.email ?? "Anonymous",
		createdAt: new Date(),
		id,
	});

	redirect(`/session/${id}`);
});
