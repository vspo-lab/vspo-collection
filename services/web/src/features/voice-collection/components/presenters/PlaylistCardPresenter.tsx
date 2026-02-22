import { Play, Download, Merge } from "lucide-react";
import { Avatar } from "@/shared/components/ui/Avatar";
import { cn } from "@/shared/lib/utils";
import { formatDuration } from "@/shared/lib/format";
import { getMemberById } from "@/shared/lib/members";
import type { Clip, Playlist } from "../../types/domain";

function formatTotalDuration(clips: Clip[]): string {
	const total = clips.reduce((sum, c) => sum + c.duration, 0);
	return formatDuration(total);
}

type PlaylistCardPresenterProps = {
	playlist: Playlist;
	clips: Clip[];
	isFavorites?: boolean;
	onPlay?: () => void;
};

export function PlaylistCardPresenter({
	playlist,
	clips,
	isFavorites = false,
	onPlay,
}: PlaylistCardPresenterProps) {
	const previewClips = clips.slice(0, 3);

	return (
		<div
			className={cn(
				"rounded-lg border border-border p-5 flex flex-col gap-4",
				"transition-shadow duration-[var(--dur-fast)] hover:shadow-[var(--shadow-soft)]",
				isFavorites
					? "bg-gradient-to-br from-like-bg to-surface"
					: "bg-surface",
			)}
		>
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-base font-bold">{playlist.title}</h3>
					<div className="flex items-center gap-2 mt-1 text-xs text-ink-muted">
						<span>
							{clips.length} clip{clips.length !== 1 ? "s" : ""}
						</span>
						{clips.length > 0 && (
							<>
								<span>-</span>
								<span>{formatTotalDuration(clips)}</span>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Preview avatars */}
			{previewClips.length > 0 && (
				<div className="flex flex-col gap-2">
					{previewClips.map((clip) => {
						const member = getMemberById(clip.memberId);
						if (!member) return null;
						return (
							<div key={clip.id} className="flex items-center gap-2 text-sm">
								<Avatar member={member} size="xs" />
								<span className="truncate text-ink-soft">{clip.title}</span>
							</div>
						);
					})}
				</div>
			)}

			{/* Actions */}
			<div className="flex items-center gap-2 mt-auto pt-2">
				<button
					type="button"
					onClick={onPlay}
					className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
				>
					<Play size={12} />
					Play
				</button>
				<button
					type="button"
					className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-accent-bg text-accent hover:bg-accent-soft transition-colors"
				>
					<Download size={12} />
					DL
				</button>
				<button
					type="button"
					className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-accent-bg text-accent hover:bg-accent-soft transition-colors"
				>
					<Merge size={12} />
					Merge
				</button>
			</div>
		</div>
	);
}
