import type { Meta, StoryObj } from "@storybook/react";
import { DateInput } from "./DateInput";

const meta = {
	title: "UI/DateInput",
	component: DateInput,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "開始日",
		value: "2025-01-01",
	},
};

export const EndDate: Story = {
	args: {
		label: "終了日",
		value: "2025-01-31",
	},
};

export const DateRangePair: Story = {
	args: {} as any,
	render: () => (
		<div className="flex flex-col gap-2 w-[220px]">
			<DateInput label="開始日" value="2025-01-01" />
			<DateInput label="終了日" value="2025-01-31" />
		</div>
	),
};
