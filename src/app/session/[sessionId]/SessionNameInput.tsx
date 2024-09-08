"use client";

import { useState } from "react";
import onSessionNameChanged from "./onSessionNameChanged";

export default function SessionNameInput({
	sessionId,
	sessionName,
}: {
	sessionId: string;
	sessionName: string;
}) {
	const [currentSessionName, setSessionName] = useState(sessionName);

	return (
		<input
			type="text"
			value={currentSessionName}
			className="w-full text-blue-600 hover:outline outline-2 rounded"
			onChange={(e) => {
				const newName = e.target.value;

				onSessionNameChanged(sessionId, newName);

				setSessionName(newName);
			}}
		/>
	);
}
