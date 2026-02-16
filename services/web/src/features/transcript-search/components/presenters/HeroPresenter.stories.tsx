import type { Meta, StoryObj } from "@storybook/react";
import { HeroPresenter } from "./HeroPresenter";

const meta = {
	title: "TranscriptSearch/HeroPresenter",
	component: HeroPresenter,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof HeroPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};
