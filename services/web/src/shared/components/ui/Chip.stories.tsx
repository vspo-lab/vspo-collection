import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "./Chip";

const meta = {
	title: "UI/Chip",
	component: Chip,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "すべて",
	},
};

export const Active: Story = {
	args: {
		label: "すべて",
		isActive: true,
	},
};

export const WithColorDot: Story = {
	args: {
		label: "花芽すみれ",
		colorDot: "#B0C4DE",
	},
};

export const ActiveWithColorDot: Story = {
	args: {
		label: "花芽すみれ",
		colorDot: "#B0C4DE",
		isActive: true,
	},
};

export const ChannelList: Story = {
	args: {} as any,
	render: () => (
		<div className="flex flex-wrap gap-1.5 max-w-[260px]">
			<Chip label="すべて" isActive />
			<Chip label="花芽すみれ" colorDot="#B0C4DE" />
			<Chip label="花芽なずな" colorDot="#FABEDC" />
			<Chip label="橘ひなの" colorDot="#FA96C8" />
			<Chip label="小雀とと" colorDot="#F5EB4A" />
			<Chip label="一ノ瀬うるは" colorDot="#4182FA" />
			<Chip label="英リサ" colorDot="#D1DE79" />
			<Chip label="神成きゅぴ" colorDot="#FFD23C" />
			<Chip label="藍沢エマ" colorDot="#B4F1F9" />
		</div>
	),
};
