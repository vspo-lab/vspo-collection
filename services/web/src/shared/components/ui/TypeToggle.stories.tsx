import type { Meta, StoryObj } from "@storybook/react";
import { TypeToggle } from "./TypeToggle";

const meta = {
	title: "UI/TypeToggle",
	component: TypeToggle,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof TypeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StreamActive: Story = {
	args: {
		videoType: "stream",
		label: "配信",
		isActive: true,
	},
};

export const StreamInactive: Story = {
	args: {
		videoType: "stream",
		label: "配信",
		isActive: false,
	},
};

export const ClipActive: Story = {
	args: {
		videoType: "clip",
		label: "切り抜き",
		isActive: true,
	},
};

export const ClipInactive: Story = {
	args: {
		videoType: "clip",
		label: "切り抜き",
		isActive: false,
	},
};

export const TogglePair: Story = {
	args: {} as any,
	render: () => (
		<div className="flex gap-1.5 w-[220px]">
			<TypeToggle videoType="stream" label="配信" isActive />
			<TypeToggle videoType="clip" label="切り抜き" isActive />
		</div>
	),
};
