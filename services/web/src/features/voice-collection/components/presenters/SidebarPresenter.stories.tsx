import type { Meta, StoryObj } from "@storybook/react";
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { SidebarPresenter } from "./SidebarPresenter";
import { mockPlaylists } from "../../__mocks__/fixtures";

function createStoryRouter() {
	const rootRoute = createRootRoute();
	const indexRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/",
		component: () => null,
	});
	const routeTree = rootRoute.addChildren([indexRoute]);
	return createRouter({
		routeTree,
		history: createMemoryHistory({ initialEntries: ["/"] }),
	});
}

const meta = {
	title: "VoiceCollection/Sidebar",
	component: SidebarPresenter,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<RouterProvider router={createStoryRouter()}>
				<div className="w-[260px] h-screen border-r border-border bg-surface">
					<Story />
				</div>
			</RouterProvider>
		),
	],
} satisfies Meta<typeof SidebarPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { playlists: mockPlaylists },
};
