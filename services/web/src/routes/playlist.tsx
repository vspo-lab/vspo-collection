import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PlaylistCardPresenter } from "@/features/voice-collection/components/presenters/PlaylistCardPresenter";
import { mockClips, mockPlaylists } from "@/features/voice-collection/__mocks__/fixtures";
import { usePlayerContext } from "@/features/voice-collection/providers/PlayerProvider";
import { usePlaylists } from "@/features/voice-collection/hooks/usePlaylists";

export const Route = createFileRoute("/playlist")({ component: PlaylistPage });

function PlaylistPage() {
	const { play } = usePlayerContext();
	const { create } = usePlaylists();

	return (
		<div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-xl font-bold">Playlists</h1>
				<button
					type="button"
					onClick={() => create("New Playlist")}
					className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
				>
					<Plus size={16} />
					New Playlist
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{mockPlaylists.map((pl) => {
					const clips = pl.clipIds
						.map((id) => mockClips.find((c) => c.id === id))
						.filter(Boolean) as typeof mockClips;

					return (
						<PlaylistCardPresenter
							key={pl.id}
							playlist={pl}
							clips={clips}
							isFavorites={pl.id === "pl-fav"}
							onPlay={() => {
								if (clips[0]) play(clips[0]);
							}}
						/>
					);
				})}
			</div>
		</div>
	);
}
