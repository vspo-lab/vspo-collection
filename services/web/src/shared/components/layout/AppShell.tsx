import { SidebarPresenter } from "@/features/voice-collection/components/presenters/SidebarPresenter";
import { TabBarPresenter } from "@/features/voice-collection/components/presenters/TabBarPresenter";
import { PlayerBarPresenter } from "@/features/voice-collection/components/presenters/PlayerBarPresenter";
import { MiniPlayerPresenter } from "@/features/voice-collection/components/presenters/MiniPlayerPresenter";
import { PlayerProvider } from "@/features/voice-collection/providers/PlayerProvider";
import type { Clip } from "@/features/voice-collection/types/domain";
import type { Playlist } from "@/features/voice-collection/types/domain";

type AppShellProps = {
	children: React.ReactNode;
	playlist?: Clip[];
	playlists?: Playlist[];
};

export function AppShell({ children, playlist = [], playlists = [] }: AppShellProps) {
	return (
		<PlayerProvider playlist={playlist}>
			<div className="min-h-screen flex flex-col md:flex-row">
				{/* Desktop sidebar */}
				<aside className="hidden md:flex md:w-[260px] md:shrink-0 md:flex-col border-r border-border bg-surface h-screen sticky top-0">
					<SidebarPresenter playlists={playlists} />
				</aside>

				{/* Main content area */}
				<main className="flex-1 min-w-0 pb-[120px] md:pb-[80px]">
					{children}
				</main>

				{/* Desktop player bar */}
				<div className="hidden md:block fixed bottom-0 left-[260px] right-0 z-40">
					<PlayerBarPresenter />
				</div>

				{/* Mobile mini player + tab bar */}
				<div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
					<MiniPlayerPresenter />
					<TabBarPresenter />
				</div>
			</div>
		</PlayerProvider>
	);
}
