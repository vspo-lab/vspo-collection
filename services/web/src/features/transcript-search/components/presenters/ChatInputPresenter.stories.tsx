import type { Meta, StoryObj } from "@storybook/react";
import { ChatInputPresenter } from "./ChatInputPresenter";

const meta = {
	title: "TranscriptSearch/ChatInputPresenter",
	component: ChatInputPresenter,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[600px]">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof ChatInputPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: "",
	},
};

export const WithValue: Story = {
	args: {
		value: "大会 練習",
	},
};

export const Disabled: Story = {
	args: {
		value: "",
		isDisabled: true,
	},
};
