/**
 * Member colors for channel identification.
 * Used in filter chips, thumbnail gradients, and channel indicators.
 */
export const memberColors = {
	// JP Members
	sumire: "#B0C4DE",
	nazuna: "#FABEDC",
	toto: "#F5EB4A",
	uruha: "#4182FA",
	noa: "#FFDBFE",
	mimi: "#C7B2D6",
	sena: "#FFFFFF",
	hinano: "#FA96C8",
	lisa: "#D1DE79",
	ren: "#BE2152",
	kyupi: "#FFD23C",
	beni: "#85CAB3",
	emma: "#B4F1F9",
	runa: "#D6ADFF",
	tsuna: "#FF3652",
	ramune: "#8ECED9",
	met: "#FBA03F",
	akari: "#FF998D",
	kuromu: "#909EC8",
	kokage: "#5195E1",
	yuuhi: "#ED784A",
	hanabi: "#EA5506",
	moka: "#ECA0AA",
	seine: "#58535E",
	chise: "#BEFF77",
	// EN Members
	remia: "#398FB2",
	arya: "#000000",
	jira: "#606D3D",
	narin: "#F3A6EF",
	riko: "#9373D7",
	eris: "#90B2F8",
} as const;

export type MemberColorKey = keyof typeof memberColors;
