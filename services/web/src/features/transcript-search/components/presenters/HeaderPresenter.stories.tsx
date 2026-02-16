import type { Meta, StoryObj } from "@storybook/react";
import { HeaderPresenter } from "./HeaderPresenter";

const meta = {
	title: "TranscriptSearch/HeaderPresenter",
	component: HeaderPresenter,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof HeaderPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const Mobile: Story = {
	args: {},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};
