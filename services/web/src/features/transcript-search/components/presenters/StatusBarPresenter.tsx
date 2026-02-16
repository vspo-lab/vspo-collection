import { motion } from "framer-motion";

type StatusBarPresenterProps = {
	isLoaded: boolean;
	totalVideos: number;
};

export function StatusBarPresenter({
	isLoaded,
	totalVideos,
}: StatusBarPresenterProps) {
	return (
		<div
			role="status"
			className="flex items-center justify-center gap-2 border-b border-border bg-surface-warm px-4 py-2 text-[0.72rem] text-ink-muted"
		>
			<motion.span
				className="h-1.5 w-1.5 rounded-full bg-mint"
				animate={{ opacity: [1, 0.4, 1] }}
				transition={{
					duration: 2,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
			/>
			{isLoaded ? (
				<span>
					Parquetデータ読み込み完了 &middot;{" "}
					<strong className="font-bold text-ink">
						{totalVideos.toLocaleString()}本
					</strong>
					の動画を検索可能
				</span>
			) : (
				<span>データを読み込み中...</span>
			)}
		</div>
	);
}
