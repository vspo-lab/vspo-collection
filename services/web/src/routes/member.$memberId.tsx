import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Play, Shuffle } from "lucide-react";
import { Avatar } from "@/shared/components/ui/Avatar";
import { ClipTablePresenter } from "@/features/voice-collection/components/presenters/ClipTablePresenter";
import { ClipListPresenter } from "@/features/voice-collection/components/presenters/ClipListPresenter";
import { usePlayerContext } from "@/features/voice-collection/providers/PlayerProvider";
import { useLikes } from "@/features/voice-collection/hooks/useLikes";
import { mockClips } from "@/features/voice-collection/__mocks__/fixtures";
import { getMemberById } from "@/shared/lib/members";
import { memberColors, type MemberColorKey } from "@/shared/lib/design-tokens";
import type { Clip } from "@/features/voice-collection/types/domain";
import { cn } from "@/shared/lib/utils";

export const Route = createFileRoute("/member/$memberId")({
	component: MemberDetailPage,
});

type SortMode = "popular" | "newest";

function isValidMemberId(id: string): id is MemberColorKey {
	return id in memberColors;
}

function MemberDetailPage() {
	const { memberId } = Route.useParams();
	const member = isValidMemberId(memberId) ? getMemberById(memberId) : undefined;
	const [sort, setSort] = useState<SortMode>("popular");
	const { currentClip, play } = usePlayerContext();
	const { likes, toggleLike } = useLikes();

	if (!member) {
		return (
			<div className="flex items-center justify-center h-64 text-ink-muted">
				Member not found
			</div>
		);
	}

	const memberClips = mockClips.filter((c) => c.memberId === member.id);
	const sortedClips =
		sort === "popular"
			? [...memberClips].sort((a, b) => b.likeCount - a.likeCount)
			: [...memberClips].sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				);

	const totalLikes = memberClips.reduce((sum, c) => sum + c.likeCount, 0);
	const handlePlay = (clip: Clip) => play(clip);
	const handlePlayAll = () => {
		if (sortedClips[0]) play(sortedClips[0]);
	};

	return (
		<div>
			{/* Hero */}
			<div
				className="px-4 md:px-8 py-8 md:py-12"
				style={{
					background: `linear-gradient(180deg, color-mix(in srgb, ${member.color} 25%, var(--bg)) 0%, var(--bg) 100%)`,
				}}
			>
				<div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
					<Avatar member={member} size="lg" className="md:hidden" />
					<Avatar member={member} size="xl" className="hidden md:flex" />
					<div className="text-center md:text-left">
						<h1 className="text-2xl md:text-3xl font-bold">{member.name}</h1>
						<div className="flex items-center gap-4 mt-2 text-sm text-ink-soft justify-center md:justify-start">
							<span>{memberClips.length} clips</span>
							<span>{totalLikes.toLocaleString()} likes</span>
						</div>
						<div className="flex items-center gap-3 mt-4 justify-center md:justify-start">
							<button
								type="button"
								onClick={handlePlayAll}
								className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
							>
								<Play size={16} />
								Play All
							</button>
							<button
								type="button"
								className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full bg-accent-bg text-accent hover:bg-accent-soft transition-colors"
							>
								<Shuffle size={16} />
								Shuffle
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Clip table */}
			<div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
				{/* Sort control */}
				<div className="flex items-center gap-4 mb-4">
					{(["popular", "newest"] as const).map((s) => (
						<button
							key={s}
							type="button"
							onClick={() => setSort(s)}
							className={cn(
								"text-sm font-medium transition-colors",
								sort === s ? "text-ink" : "text-ink-muted hover:text-ink-soft",
							)}
						>
							{s === "popular" ? "Popular" : "Newest"}
						</button>
					))}
				</div>

				<div className="hidden md:block">
					<ClipTablePresenter
						clips={sortedClips}
						playingClipId={currentClip?.id ?? null}
						likedClipIds={likes}
						onPlay={handlePlay}
						onLikeToggle={toggleLike}
					/>
				</div>
				<div className="md:hidden">
					<ClipListPresenter
						clips={sortedClips}
						playingClipId={currentClip?.id ?? null}
						likedClipIds={likes}
						onPlay={handlePlay}
						onLikeToggle={toggleLike}
					/>
				</div>
			</div>
		</div>
	);
}
