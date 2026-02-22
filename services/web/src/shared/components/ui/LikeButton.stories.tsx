import type { Meta, StoryObj } from "@storybook/react";
import { LikeButton } from "./LikeButton";

const meta = {
	title: "UI/LikeButton",
	component: LikeButton,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof LikeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {
	args: { isLiked: false, count: 42, onToggle: () => {} },
};

export const Active: Story = {
	args: { isLiked: true, count: 43, onToggle: () => {} },
};

export const WithoutCount: Story = {
	args: { isLiked: false, onToggle: () => {} },
};
