import { useCallback, useState } from "react";
import type { Clip } from "../types/domain";

export type PlayerState = {
	currentClip: Clip | null;
	isPlaying: boolean;
	progress: number;
	volume: number;
};

export type PlayerActions = {
	play: (clip: Clip) => void;
	pause: () => void;
	resume: () => void;
	next: () => void;
	prev: () => void;
	seek: (progress: number) => void;
	setVolume: (volume: number) => void;
};

export function usePlayerState(
	playlist: Clip[] = [],
): PlayerState & PlayerActions {
	const [currentClip, setCurrentClip] = useState<Clip | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [volume, setVolume] = useState(0.8);

	const play = useCallback((clip: Clip) => {
		setCurrentClip(clip);
		setIsPlaying(true);
		setProgress(0);
	}, []);

	const pause = useCallback(() => setIsPlaying(false), []);
	const resume = useCallback(() => setIsPlaying(true), []);

	const next = useCallback(() => {
		if (!currentClip || playlist.length === 0) return;
		const idx = playlist.findIndex((c) => c.id === currentClip.id);
		const nextClip = playlist[(idx + 1) % playlist.length];
		if (nextClip) play(nextClip);
	}, [currentClip, playlist, play]);

	const prev = useCallback(() => {
		if (!currentClip || playlist.length === 0) return;
		const idx = playlist.findIndex((c) => c.id === currentClip.id);
		const prevClip = playlist[(idx - 1 + playlist.length) % playlist.length];
		if (prevClip) play(prevClip);
	}, [currentClip, playlist, play]);

	const seek = useCallback((p: number) => setProgress(p), []);
	const setVol = useCallback((v: number) => setVolume(v), []);

	return {
		currentClip,
		isPlaying,
		progress,
		volume,
		play,
		pause,
		resume,
		next,
		prev,
		seek,
		setVolume: setVol,
	};
}
