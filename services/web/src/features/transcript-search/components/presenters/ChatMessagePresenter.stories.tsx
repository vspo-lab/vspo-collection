import type { Meta, StoryObj } from "@storybook/react";
import {
	mockVideoCard1,
	mockVideoCard2,
	mockVideoCard3,
} from "../../__mocks__/fixtures";
import { ChatMessagePresenter } from "./ChatMessagePresenter";

const meta = {
	title: "TranscriptSearch/ChatMessagePresenter",
	component: ChatMessagePresenter,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[800px] p-6">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof ChatMessagePresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
	args: {
		message: {
			type: "user",
			content: "大会 練習",
		},
	},
};

export const SystemMessageWithResults: Story = {
	args: {
		message: {
			type: "system",
			resultCount: 3,
			videos: [mockVideoCard1, mockVideoCard2, mockVideoCard3],
		},
	},
};

export const SystemMessageZeroResults: Story = {
	args: {
		message: {
			type: "system",
			resultCount: 0,
			videos: [],
		},
	},
};

export const Conversation: Story = {
	args: {} as any,
	render: () => (
		<div className="flex flex-col gap-5">
			<ChatMessagePresenter message={{ type: "user", content: "大会 練習" }} />
			<ChatMessagePresenter
				message={{
					type: "system",
					resultCount: 3,
					videos: [mockVideoCard1, mockVideoCard2, mockVideoCard3],
				}}
			/>
		</div>
	),
};
