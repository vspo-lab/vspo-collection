import { useCallback, useState } from "react";
import { z } from "zod";
import { type Playlist, playlistSchema } from "../types/domain";

const STORAGE_KEY = "vspo-voice-playlists";
const playlistsArraySchema = z.array(playlistSchema);

function loadPlaylists(): Playlist[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const result = playlistsArraySchema.safeParse(JSON.parse(raw));
		return result.success ? result.data : [];
	} catch {
		return [];
	}
}

function savePlaylists(playlists: Playlist[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
}

export function usePlaylists() {
	const [playlists, setPlaylists] = useState<Playlist[]>(loadPlaylists);

	const create = useCallback((title: string) => {
		setPlaylists((prev) => {
			const next = [
				...prev,
				{
					id: `pl-${Date.now()}`,
					title,
					clipIds: [],
					createdAt: new Date().toISOString().split("T")[0] ?? "",
				},
			];
			savePlaylists(next);
			return next;
		});
	}, []);

	const remove = useCallback((id: string) => {
		setPlaylists((prev) => {
			const next = prev.filter((p) => p.id !== id);
			savePlaylists(next);
			return next;
		});
	}, []);

	const addClip = useCallback((playlistId: string, clipId: string) => {
		setPlaylists((prev) => {
			const next = prev.map((p) =>
				p.id === playlistId && !p.clipIds.includes(clipId)
					? { ...p, clipIds: [...p.clipIds, clipId] }
					: p,
			);
			savePlaylists(next);
			return next;
		});
	}, []);

	const removeClip = useCallback((playlistId: string, clipId: string) => {
		setPlaylists((prev) => {
			const next = prev.map((p) =>
				p.id === playlistId
					? { ...p, clipIds: p.clipIds.filter((id) => id !== clipId) }
					: p,
			);
			savePlaylists(next);
			return next;
		});
	}, []);

	return { playlists, create, remove, addClip, removeClip };
}
