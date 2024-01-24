declare global {
	type Card = {
		cid: number;
		name: string;
		art: string;
		cost: number;
		power: number;
		source: string;
		status: string;
		// ability: string;
		// alternate_art: string;
		// carddeifd: string;
		// colorist: string;
		// difficulty: string;
		// flavor: string;
		// inker: string;
		// rarity: string;
		// rarity_slug: string;
		// sketcher: string;
		// source_slug: string;
		// tags: [];
		// type: string;
		// url: string;
		// variants: [];
	} & {};
	type Order = "cost" | "power" | "name";
	type Direction = "ASC" | "DESC";
	type JsonDeckCode = {
		Cards: {
			CardDefId: string;
		}[];
	};
}

export {};
