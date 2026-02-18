import type { Meta, StoryObj } from "@storybook/react";
import { CheckCircle, Database, Zap } from "lucide-react";
import { Badge } from "./Badge";

const meta = {
	title: "UI/Badge",
	component: Badge,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "DuckDB-WASM",
	},
};

export const Accent: Story = {
	args: {
		variant: "accent",
		children: "ブラウザ完結",
	},
};

export const WithIcon: Story = {
	args: {
		variant: "accent",
		icon: <CheckCircle />,
		children: "ブラウザ完結",
	},
};

export const YouTube: Story = {
	args: {
		variant: "youtube",
		children: "YouTube",
	},
};

export const X: Story = {
	args: {
		variant: "x",
		children: "X",
	},
};

export const AllVariants: Story = {
	args: {} as any,
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Badge variant="accent" icon={<CheckCircle />}>
				ブラウザ完結
			</Badge>
			<Badge icon={<Database />}>DuckDB-WASM</Badge>
			<Badge icon={<Zap />}>サーバー不要</Badge>
			<Badge variant="youtube">YouTube</Badge>
			<Badge variant="x">X</Badge>
		</div>
	),
};
