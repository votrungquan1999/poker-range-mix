export interface PokerSessionDocument {
	id: string;

	createdBy: string;
	createdAt: number;
	updatedAt: number;

	name: string;
	hands: PokerHand[];
}

export interface PokerHand {
	id: string;
	order: number;

	position: PositionType;
	streets: Record<StreetType, PokerStreet>;

	playedAt: number;
}

export interface PokerStreet {
	hand: HandType;
	action: ActionType;
}

export type PositionType = "IP" | "OOP";

export type StreetType = "PRE" | "FLOP" | "TURN" | "RIVER";

export type HandType = "WEAK" | "MED" | "STR" | "NUT";

export type ActionType =
	| "Check"
	| "Check-Raise"
	| "Bet"
	| "Re-Raise"
	| "All In"
	| "Fold";
