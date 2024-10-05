"use client";

import * as Switch from "@radix-ui/react-switch";
import { useRef } from "react";

type SwitchProps =
	| {
			checked: boolean;
			labelNode: React.ReactNode;
			onCheckedChange: (checked: boolean) => void;
	  }
	| {
			checked: boolean;
			labelNode: React.ReactNode;
			submitOnChange: true;
	  };

export default function SwitchComponent(props: SwitchProps) {
	const ref = useRef<HTMLButtonElement>(null);

	const { checked, labelNode } = props;

	function onCheckedChange(checked: boolean) {
		if ("submitOnChange" in props) {
			if (ref.current) {
				ref.current.form?.requestSubmit();
			}

			return;
		}

		props.onCheckedChange(checked);
	}

	return (
		<div className="flex items-center gap-2">
			<label htmlFor="airplane-mode">{labelNode}</label>
			<Switch.Root
				ref={ref}
				checked={checked}
				onCheckedChange={onCheckedChange}
				className="relative h-[25px] w-[42px] cursor-default rounded-full border shadow border-slate-200 data-[state=checked]:bg-blue-600"
				id="airplane-mode"
			>
				<Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-slate-100 border border-slate-200 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
			</Switch.Root>
		</div>
	);
}
