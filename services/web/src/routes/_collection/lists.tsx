import { mockPlaylists } from "@/features/collection/__mocks__/fixtures";
import { PlaylistPagePresenter } from "@/features/collection/components/presenters/PlaylistPagePresenter";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_collection/lists")({
	component: PlaylistPage,
});

function PlaylistPage() {
	return <PlaylistPagePresenter playlists={mockPlaylists} />;
}
