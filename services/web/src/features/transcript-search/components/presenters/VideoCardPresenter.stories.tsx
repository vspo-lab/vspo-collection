import type { Meta, StoryObj } from "@storybook/react";
import {
	mockVideoCard1,
	mockVideoCard2,
	mockVideoCard3,
	mockVideoCard4,
	mockVideoCard5,
} from "../../__mocks__/fixtures";
import { VideoCardPresenter } from "./VideoCardPresenter";

const meta = {
	title: "TranscriptSearch/VideoCardPresenter",
	component: VideoCardPresenter,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[680px] max-md:w-[360px]">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof VideoCardPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StreamCard: Story = {
	args: {
		video: mockVideoCard1,
	},
};

export const ClipCard: Story = {
	args: {
		video: mockVideoCard3,
	},
};

export const ManyTimestamps: Story = {
	args: {
		video: mockVideoCard2,
	},
};

export const CardList: Story = {
	args: {} as any,
	render: () => (
		<div className="flex flex-col gap-3">
			<VideoCardPresenter video={mockVideoCard1} />
			<VideoCardPresenter video={mockVideoCard2} />
			<VideoCardPresenter video={mockVideoCard3} />
			<VideoCardPresenter video={mockVideoCard4} />
			<VideoCardPresenter video={mockVideoCard5} />
		</div>
	),
};

export const Mobile: Story = {
	args: {
		video: mockVideoCard1,
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
	decorators: [
		(Story) => (
			<div className="w-full p-4">
				<Story />
			</div>
		),
	],
};
