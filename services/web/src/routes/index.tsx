import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Chip } from "@/shared/components/ui/Chip";
import { ClipTablePresenter } from "@/features/voice-collection/components/presenters/ClipTablePresenter";
import { ClipListPresenter } from "@/features/voice-collection/components/presenters/ClipListPresenter";
import { usePlayerContext } from "@/features/voice-collection/providers/PlayerProvider";
import { useLikes } from "@/features/voice-collection/hooks/useLikes";
import { mockClips } from "@/features/voice-collection/__mocks__/fixtures";
import { members } from "@/shared/lib/members";
import type { MemberColorKey } from "@/shared/lib/design-tokens";
import type { Clip } from "@/features/voice-collection/types/domain";
import { cn } from "@/shared/lib/utils";

export const Route = createFileRoute("/")({ component: HomePage });

type Tab = "popular" | "new";

function HomePage() {
	const [activeTab, setActiveTab] = useState<Tab>("popular");
	const [selectedMember, setSelectedMember] = useState<MemberColorKey | null>(null);
	const { currentClip, play } = usePlayerContext();
	const { likes, toggleLike } = useLikes();

	const filteredClips = selectedMember
		? mockClips.filter((c) => c.memberId === selectedMember)
		: mockClips;

	const sortedClips =
		activeTab === "popular"
			? [...filteredClips].sort((a, b) => b.likeCount - a.likeCount)
			: [...filteredClips].sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				);

	const handlePlay = (clip: Clip) => play(clip);

	return (
		<div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
			{/* Tabs */}
			<div className="flex items-center gap-6 border-b border-border mb-4">
				{(["popular", "new"] as const).map((tab) => (
					<button
						key={tab}
						type="button"
						onClick={() => setActiveTab(tab)}
						className={cn(
							"pb-2.5 text-sm font-medium border-b-2 transition-colors duration-[var(--dur-fast)]",
							activeTab === tab
								? "border-accent text-accent"
								: "border-transparent text-ink-muted hover:text-ink-soft",
						)}
					>
						{tab === "popular" ? "Popular" : "New"}
					</button>
				))}
			</div>

			{/* Member filter chips */}
			<div className="flex gap-1.5 overflow-x-auto pb-4 scrollbar-none">
				<Chip
					label="All"
					isActive={selectedMember === null}
					onClick={() => setSelectedMember(null)}
				/>
				{members.slice(0, 12).map((m) => (
					<Chip
						key={m.id}
						label={m.name}
						colorDot={m.color}
						isActive={selectedMember === m.id}
						onClick={() =>
							setSelectedMember(selectedMember === m.id ? null : m.id)
						}
					/>
				))}
			</div>

			{/* Clip display */}
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
	);
}
