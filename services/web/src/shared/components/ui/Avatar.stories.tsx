import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";
import { members } from "@/shared/lib/members";

const sumire = members.find((m) => m.id === "sumire")!;
const sena = members.find((m) => m.id === "sena")!;
const uruha = members.find((m) => m.id === "uruha")!;

const meta = {
	title: "UI/Avatar",
	component: Avatar,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExtraSmall: Story = { args: { member: sumire, size: "xs" } };
export const Small: Story = { args: { member: sumire, size: "sm" } };
export const Medium: Story = { args: { member: sumire, size: "md" } };
export const Large: Story = { args: { member: sumire, size: "lg" } };
export const ExtraLarge: Story = { args: { member: sumire, size: "xl" } };

export const DarkTextOnLight: Story = {
	args: { member: sumire, size: "md" },
};

export const LightTextOnDark: Story = {
	args: { member: uruha, size: "md" },
};

export const SenaWithBorder: Story = {
	args: { member: sena, size: "md" },
};

export const AllMembers: Story = {
	args: { member: sumire, size: "md" } as any,
	render: () => (
		<div className="flex flex-wrap gap-2 max-w-[400px]">
			{members.map((m) => (
				<Avatar key={m.id} member={m} size="md" />
			))}
		</div>
	),
};
