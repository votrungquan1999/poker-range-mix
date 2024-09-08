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

	position?: PositionType;
	activeStreet: StreetType;

	streets: {
		PRE?: PokerStreet;
		FLOP?: PokerStreet;
		TURN?: PokerStreet;
		RIVER?: PokerStreet;
	};

	playedAt: number;
}

export interface PokerStreet {
	hand?: HandType;
	action?: ActionType;
}

export type PositionType = "IP" | "OOP";

export type StreetType = "FLOP" | "TURN" | "RIVER";

export type HandType = "WEAK" | "MED" | "STR" | "DRAW" | "NUT";

export type ActionType =
	| "Check"
	| "Check-Raise"
	| "Bet"
	| "Re-Raise"
	| "All In"
	| "Fold";
