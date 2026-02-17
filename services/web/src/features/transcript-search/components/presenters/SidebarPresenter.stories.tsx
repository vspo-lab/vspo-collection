import type { Meta, StoryObj } from "@storybook/react";
import { defaultFilterState, mockChannels } from "../../__mocks__/fixtures";
import { SidebarPresenter } from "./SidebarPresenter";

const meta = {
	title: "TranscriptSearch/SidebarPresenter",
	component: SidebarPresenter,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="flex min-h-screen">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof SidebarPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		channels: mockChannels.filter((ch) => ch.group === "JP").slice(0, 12),
		filters: defaultFilterState,
	},
};

export const WithActiveFilters: Story = {
	args: {
		channels: mockChannels.filter((ch) => ch.group === "JP").slice(0, 12),
		filters: {
			selectedChannels: ["sumire", "hinano"],
			videoTypes: { stream: true, clip: false },
			dateRange: { start: "2025-01-01", end: "2025-01-31" },
		},
	},
};

export const AllChannels: Story = {
	args: {
		channels: mockChannels,
		filters: defaultFilterState,
	},
};

export const MobileOpen: Story = {
	args: {
		channels: mockChannels.filter((ch) => ch.group === "JP").slice(0, 12),
		filters: defaultFilterState,
		isOpen: true,
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};
