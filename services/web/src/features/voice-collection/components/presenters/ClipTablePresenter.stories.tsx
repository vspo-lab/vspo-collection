import type { Meta, StoryObj } from "@storybook/react";
import { mockClips } from "../../__mocks__/fixtures";
import { ClipTablePresenter } from "./ClipTablePresenter";

const meta = {
	title: "VoiceCollection/ClipTable",
	component: ClipTablePresenter,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
} satisfies Meta<typeof ClipTablePresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		clips: mockClips,
		playingClipId: null,
		likedClipIds: new Set(),
		onPlay: () => {},
		onLikeToggle: () => {},
	},
};

export const WithPlayingClip: Story = {
	args: {
		clips: mockClips,
		playingClipId: "c1",
		likedClipIds: new Set(["c1", "c3"]),
		onPlay: () => {},
		onLikeToggle: () => {},
	},
};
