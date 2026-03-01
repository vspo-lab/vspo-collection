import { Avatar } from "@/shared/components/ui/Avatar";
import { PlayingBars } from "@/shared/components/ui/PlayingBars";
import { formatDuration } from "@/shared/lib/format";
import { getMemberById } from "@/shared/lib/members";
import { cn } from "@/shared/lib/utils";
import { Heart } from "lucide-react";
import type { Clip } from "../../types/domain";

type ClipListPresenterProps = {
	clips: Clip[];
	playingClipId: string | null;
	likedClipIds: Set<string>;
	onPlay: (clip: Clip) => void;
	onLikeToggle: (clipId: string) => void;
};

export function ClipListPresenter({
	clips,
	playingClipId,
	likedClipIds,
	onPlay,
	onLikeToggle,
}: ClipListPresenterProps) {
	return (
		<ul className="divide-y divide-border">
			{clips.map((clip) => {
				const member = getMemberById(clip.memberId);
				if (!member) return null;
				const isPlaying = clip.id === playingClipId;
				const isLiked = likedClipIds.has(clip.id);

				return (
					<li
						key={clip.id}
						onClick={() => onPlay(clip)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								onPlay(clip);
							}
						}}
						className={cn(
							"flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors duration-[var(--dur-fast)]",
							isPlaying ? "bg-accent-bg" : "active:bg-surface-warm",
						)}
					>
						<div className="relative">
							<Avatar member={member} size="md" />
							{isPlaying && (
								<div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
									<PlayingBars className="[&_span]:bg-white" />
								</div>
							)}
						</div>
						<div className="flex-1 min-w-0">
							<div
								className={cn(
									"text-sm font-medium truncate",
									isPlaying && "text-accent",
								)}
							>
								{clip.title}
							</div>
							<div className="text-xs text-ink-muted">{member.name}</div>
						</div>
						<div className="flex items-center gap-3 shrink-0">
							<span className="text-xs text-ink-muted tabular-nums">
								{formatDuration(clip.duration)}
							</span>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onLikeToggle(clip.id);
								}}
								className={cn(
									"inline-flex items-center gap-0.5 text-xs",
									isLiked ? "text-like" : "text-ink-muted",
								)}
								aria-label={isLiked ? "Unlike" : "Like"}
							>
								<Heart
									size={13}
									fill={isLiked ? "currentColor" : "none"}
									strokeWidth={isLiked ? 0 : 2}
								/>
								{clip.likeCount}
							</button>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
