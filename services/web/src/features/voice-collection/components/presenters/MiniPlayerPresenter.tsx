import { Pause, Play, SkipForward } from "lucide-react";
import { Avatar } from "@/shared/components/ui/Avatar";
import { usePlayerContext } from "../../providers/PlayerProvider";
import { getMemberById } from "@/shared/lib/members";

export function MiniPlayerPresenter() {
	const { currentClip, isPlaying, progress, pause, resume, next } =
		usePlayerContext();

	if (!currentClip) return null;

	const member = getMemberById(currentClip.memberId);
	if (!member) return null;

	return (
		<div className="bg-surface border-t border-border">
			{/* Progress line */}
			<div className="h-0.5 bg-border">
				<div
					className="h-full bg-accent"
					style={{ width: `${progress * 100}%` }}
				/>
			</div>

			<div className="flex items-center gap-3 px-4 py-2">
				<Avatar member={member} size="sm" />
				<div className="flex-1 min-w-0">
					<div className="text-sm font-medium truncate">{currentClip.title}</div>
					<div className="text-xs text-ink-muted truncate">{member.name}</div>
				</div>
				<button
					type="button"
					onClick={isPlaying ? pause : resume}
					className="text-ink p-1"
					aria-label={isPlaying ? "Pause" : "Play"}
				>
					{isPlaying ? <Pause size={20} /> : <Play size={20} />}
				</button>
				<button
					type="button"
					onClick={next}
					className="text-ink-muted p-1"
					aria-label="Next"
				>
					<SkipForward size={20} />
				</button>
			</div>
		</div>
	);
}
