import { createContext, useContext } from "react";
import {
	type PlayerActions,
	type PlayerState,
	usePlayerState,
} from "../hooks/usePlayerState";
import type { Clip } from "../types/domain";

type PlayerContextValue = PlayerState & PlayerActions;

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({
	playlist,
	children,
}: {
	playlist?: Clip[];
	children: React.ReactNode;
}) {
	const state = usePlayerState(playlist);
	return <PlayerContext value={state}>{children}</PlayerContext>;
}

export function usePlayerContext(): PlayerContextValue {
	const ctx = useContext(PlayerContext);
	if (!ctx) {
		throw new Error("usePlayerContext must be used within PlayerProvider");
	}
	return ctx;
}
