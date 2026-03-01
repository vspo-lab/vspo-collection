import { Avatar } from "@/shared/components/ui/Avatar";
import { PlayingBars } from "@/shared/components/ui/PlayingBars";
import { formatDuration } from "@/shared/lib/format";
import { getMemberById } from "@/shared/lib/members";
import { cn } from "@/shared/lib/utils";
import { Heart, Play } from "lucide-react";
import type { Clip } from "../../types/domain";

type ClipTablePresenterProps = {
	clips: Clip[];
	playingClipId: string | null;
	likedClipIds: Set<string>;
	onPlay: (clip: Clip) => void;
	onLikeToggle: (clipId: string) => void;
};

export function ClipTablePresenter({
	clips,
	playingClipId,
	likedClipIds,
	onPlay,
	onLikeToggle,
}: ClipTablePresenterProps) {
	return (
		<table className="w-full text-sm">
			<thead>
				<tr className="text-xs text-ink-muted border-b border-border">
					<th className="text-left py-2 px-3 w-10 font-normal">#</th>
					<th className="text-left py-2 px-2 font-normal">Title</th>
					<th className="text-left py-2 px-2 font-normal">Member</th>
					<th className="text-right py-2 px-2 font-normal w-16">Duration</th>
					<th className="text-right py-2 px-3 font-normal w-16">Likes</th>
				</tr>
			</thead>
			<tbody>
				{clips.map((clip, i) => {
					const member = getMemberById(clip.memberId);
					if (!member) return null;
					const isPlaying = clip.id === playingClipId;
					const isLiked = likedClipIds.has(clip.id);

					return (
						<tr
							key={clip.id}
							className={cn(
								"group cursor-pointer transition-colors duration-[var(--dur-fast)]",
								isPlaying ? "bg-accent-bg" : "hover:bg-surface-warm",
							)}
							onClick={() => onPlay(clip)}
						>
							<td className="py-2.5 px-3 text-ink-muted">
								{isPlaying ? (
									<PlayingBars />
								) : (
									<span className="group-hover:hidden">{i + 1}</span>
								)}
								{!isPlaying && (
									<Play
										size={14}
										className="hidden group-hover:block text-ink-soft"
									/>
								)}
							</td>
							<td className="py-2.5 px-2">
								<span className={cn("font-medium", isPlaying && "text-accent")}>
									{clip.title}
								</span>
							</td>
							<td className="py-2.5 px-2">
								<div className="flex items-center gap-2">
									<Avatar member={member} size="xs" />
									<span className="text-ink-soft">{member.name}</span>
								</div>
							</td>
							<td className="py-2.5 px-2 text-right text-ink-muted tabular-nums">
								{formatDuration(clip.duration)}
							</td>
							<td className="py-2.5 px-3 text-right">
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										onLikeToggle(clip.id);
									}}
									className={cn(
										"inline-flex items-center gap-1 text-xs",
										isLiked ? "text-like" : "text-ink-muted hover:text-like",
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
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
