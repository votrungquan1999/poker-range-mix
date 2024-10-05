"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitButton({
	pendingButton,
	children,
	completedButton,
}: {
	pendingButton: React.ReactNode;
	children: React.ReactNode;
	completedButton?: React.ReactNode;
}) {
	const { pending } = useFormStatus();

	const [completed, setCompleted] = useState(false);

	useEffect(() => {
		if (!pending) {
			setCompleted(true);
		}
	}, [pending]);

	if (pending) {
		return pendingButton;
	}

	if (completed && completedButton) {
		return completedButton;
	}

	return children;
}
