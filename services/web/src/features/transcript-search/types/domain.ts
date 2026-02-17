/** VTuber channel information */
export type Channel = {
	id: string;
	name: string;
	colorHex: string;
	group: "JP" | "EN";
};

/** Video type classification */
export type VideoType = "stream" | "clip";

/** Timestamp with search result context */
export type Timestamp = {
	time: string;
	timeInSeconds: number;
	text: string;
	highlightedText: string;
};

/** Video card data */
export type VideoCard = {
	id: string;
	title: string;
	channel: Channel;
	date: string;
	type: VideoType;
	duration: string;
	thumbnailGradient: string;
	timestamps: Timestamp[];
	url: string;
};

/** User search message */
export type UserMessage = {
	type: "user";
	content: string;
};

/** System response message with search results */
export type SystemMessage = {
	type: "system";
	resultCount: number;
	videos: VideoCard[];
};

/** Union of all chat message types */
export type SearchMessage = UserMessage | SystemMessage;

/** Filter panel state */
export type FilterState = {
	selectedChannels: string[];
	videoTypes: {
		stream: boolean;
		clip: boolean;
	};
	dateRange: {
		start: string | null;
		end: string | null;
	};
};

/** Status bar data */
export type StatusBarData = {
	isLoaded: boolean;
	totalVideos: number;
};
