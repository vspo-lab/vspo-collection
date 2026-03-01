import type { Meta, StoryObj } from "@storybook/react";
import { mockClips, mockPlaylists } from "../../__mocks__/fixtures";
import { PlaylistCardPresenter } from "./PlaylistCardPresenter";

const favPlaylist = mockPlaylists[0]!;
const regularPlaylist = mockPlaylists[1]!;

function resolveClips(ids: string[]) {
	return ids
		.map((id) => mockClips.find((c) => c.id === id))
		.filter(Boolean) as typeof mockClips;
}

const meta = {
	title: "VoiceCollection/PlaylistCard",
	component: PlaylistCardPresenter,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[360px]">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof PlaylistCardPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		playlist: regularPlaylist,
		clips: resolveClips(regularPlaylist.clipIds),
	},
};

export const Favorites: Story = {
	args: {
		playlist: favPlaylist,
		clips: resolveClips(favPlaylist.clipIds),
		isFavorites: true,
	},
};
