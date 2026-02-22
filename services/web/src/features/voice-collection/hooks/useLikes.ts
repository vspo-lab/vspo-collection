import { useCallback, useSyncExternalStore } from "react";
import { z } from "zod";

const STORAGE_KEY = "vspo-voice-likes";
const likedIdsSchema = z.array(z.string());

function getSnapshot(): Set<string> {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return new Set();
		const result = likedIdsSchema.safeParse(JSON.parse(raw));
		return result.success ? new Set(result.data) : new Set();
	} catch {
		return new Set();
	}
}

let cached = getSnapshot();
const listeners = new Set<() => void>();

function emitChange() {
	for (const cb of listeners) cb();
}

function subscribe(callback: () => void): () => void {
	listeners.add(callback);
	const handler = (e: StorageEvent) => {
		if (e.key === STORAGE_KEY) {
			cached = getSnapshot();
			callback();
		}
	};
	window.addEventListener("storage", handler);
	return () => {
		listeners.delete(callback);
		window.removeEventListener("storage", handler);
	};
}

export function useLikes() {
	const likes = useSyncExternalStore(
		subscribe,
		() => cached,
		() => new Set<string>(),
	);

	const toggleLike = useCallback((clipId: string) => {
		const current = new Set(cached);
		if (current.has(clipId)) {
			current.delete(clipId);
		} else {
			current.add(clipId);
		}
		localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
		cached = current;
		emitChange();
	}, []);

	const isLiked = useCallback((clipId: string) => likes.has(clipId), [likes]);

	return { likes, toggleLike, isLiked };
}
