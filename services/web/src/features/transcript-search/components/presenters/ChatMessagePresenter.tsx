import { motion } from "framer-motion";
import { Navigation, Search } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { SearchMessage, VideoCard } from "../../types/domain";
import { VideoCardPresenter } from "./VideoCardPresenter";

type ChatMessagePresenterProps = {
	message: SearchMessage;
};

export function ChatMessagePresenter({ message }: ChatMessagePresenterProps) {
	if (message.type === "user") {
		return <UserMessageBubble content={message.content} />;
	}
	return (
		<SystemMessageBubble
			resultCount={message.resultCount}
			videos={message.videos}
		/>
	);
}

function UserMessageBubble({ content }: { content: string }) {
	return (
		<motion.div
			className="flex justify-end gap-2.5"
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
		>
			<div
				className={cn(
					"max-w-[720px] rounded-lg rounded-br-sm",
					"bg-ink px-[18px] py-3 text-[0.92rem] font-medium text-white",
				)}
			>
				{content}
			</div>
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-accent text-[0.75rem] font-bold text-ink">
				U
			</div>
		</motion.div>
	);
}

function SystemMessageBubble({
	resultCount,
	videos,
}: {
	resultCount: number;
	videos: VideoCard[];
}) {
	return (
		<motion.div
			className="flex justify-start gap-2.5"
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1], delay: 0.1 }}
		>
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-ink text-white">
				<Search className="h-4 w-4" />
			</div>
			<div
				className={cn(
					"max-w-[720px] rounded-lg rounded-bl-sm",
					"border border-border bg-surface px-5 py-4",
					"shadow-[var(--shadow-card)]",
				)}
			>
				{/* Result count */}
				<div className="mb-4 flex items-center gap-1.5 text-[0.85rem] text-ink-muted">
					<Navigation className="h-3.5 w-3.5" />
					<strong className="font-bold text-ink">{resultCount}件</strong>
					見つかりました
				</div>

				{/* Video cards */}
				<div className="flex flex-col gap-3">
					{videos.map((video) => (
						<VideoCardPresenter key={video.id} video={video} />
					))}
				</div>
			</div>
		</motion.div>
	);
}
