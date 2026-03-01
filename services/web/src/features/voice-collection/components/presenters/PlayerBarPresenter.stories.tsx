import type { Meta, StoryObj } from "@storybook/react";
import { mockClips } from "../../__mocks__/fixtures";
import { PlayerProvider } from "../../providers/PlayerProvider";
import { PlayerBarPresenter } from "./PlayerBarPresenter";

const meta = {
	title: "VoiceCollection/PlayerBar",
	component: PlayerBarPresenter,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<PlayerProvider playlist={mockClips}>
				<div className="fixed bottom-0 left-0 right-0">
					<Story />
				</div>
			</PlayerProvider>
		),
	],
} satisfies Meta<typeof PlayerBarPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
