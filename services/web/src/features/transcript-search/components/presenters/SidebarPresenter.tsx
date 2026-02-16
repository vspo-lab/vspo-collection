import { SlidersHorizontal, X } from "lucide-react";
import { Chip } from "@/shared/components/ui/Chip";
import { DateInput } from "@/shared/components/ui/DateInput";
import { TypeToggle } from "@/shared/components/ui/TypeToggle";
import { cn } from "@/shared/lib/utils";
import type { Channel, FilterState } from "../../types/domain";

type SidebarPresenterProps = {
	channels: Channel[];
	filters: FilterState;
	isOpen?: boolean;
	onClose?: () => void;
	onChannelToggle?: (channelId: string) => void;
	onTypeToggle?: (type: "stream" | "clip") => void;
	onDateChange?: (field: "start" | "end", value: string) => void;
};

export function SidebarPresenter({
	channels,
	filters,
	isOpen = false,
	onClose,
	onChannelToggle,
	onTypeToggle,
	onDateChange,
}: SidebarPresenterProps) {
	const isAllSelected = filters.selectedChannels.length === 0;

	return (
		<>
			{/* Overlay (mobile) */}
			<div
				className={cn(
					"fixed inset-0 z-[200] bg-black/30 transition-opacity duration-[var(--dur-md)] ease-[var(--ease)] md:hidden",
					isOpen ? "block opacity-100" : "hidden opacity-0",
				)}
				onClick={onClose}
			/>

			{/* Sidebar */}
			<aside
				className={cn(
					"w-[260px] shrink-0 overflow-y-auto border-r border-border bg-surface p-6 pr-5",
					"transition-transform duration-[var(--dur-md)] ease-[var(--ease)]",
					// Desktop: static, always visible
					"max-md:fixed max-md:top-0 max-md:left-0 max-md:bottom-0 max-md:z-[201] max-md:w-[280px] max-md:shadow-[var(--shadow-card)]",
					isOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
				)}
				role="complementary"
				aria-label="検索フィルター"
			>
				{/* Close button (mobile) */}
				<button
					type="button"
					onClick={onClose}
					aria-label="閉じる"
					className={cn(
						"absolute right-4 top-4 hidden max-md:flex",
						"h-8 w-8 items-center justify-center",
						"rounded-sm border-0 bg-surface-warm text-ink-muted",
						"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2",
					)}
				>
					<X className="h-4 w-4" />
				</button>

				{/* Title */}
				<div className="mb-5 flex items-center gap-2 font-display text-[0.85rem] font-semibold text-ink">
					<SlidersHorizontal className="h-4 w-4 text-ink-muted" />
					フィルター
				</div>

				{/* Channel filter */}
				<div className="mb-6">
					<span className="mb-2.5 block text-[0.72rem] font-bold tracking-wider text-ink-muted">
						チャンネル
					</span>
					<div className="flex flex-wrap gap-1.5">
						<Chip
							label="すべて"
							isActive={isAllSelected}
							onClick={() => onChannelToggle?.("")}
						/>
						{channels.map((ch) => (
							<Chip
								key={ch.id}
								label={ch.name}
								colorDot={ch.colorHex}
								isActive={filters.selectedChannels.includes(ch.id)}
								onClick={() => onChannelToggle?.(ch.id)}
							/>
						))}
					</div>
				</div>

				{/* Video type filter */}
				<div className="mb-6">
					<span className="mb-2.5 block text-[0.72rem] font-bold tracking-wider text-ink-muted">
						動画タイプ
					</span>
					<div className="flex gap-1.5">
						<TypeToggle
							videoType="stream"
							label="配信"
							isActive={filters.videoTypes.stream}
							onClick={() => onTypeToggle?.("stream")}
						/>
						<TypeToggle
							videoType="clip"
							label="切り抜き"
							isActive={filters.videoTypes.clip}
							onClick={() => onTypeToggle?.("clip")}
						/>
					</div>
				</div>

				{/* Date range filter */}
				<div className="mb-6">
					<span className="mb-2.5 block text-[0.72rem] font-bold tracking-wider text-ink-muted">
						期間
					</span>
					<div className="flex flex-col gap-2">
						<DateInput
							label="開始日"
							value={filters.dateRange.start ?? ""}
							onChange={(v) => onDateChange?.("start", v)}
						/>
						<DateInput
							label="終了日"
							value={filters.dateRange.end ?? ""}
							onChange={(v) => onDateChange?.("end", v)}
						/>
					</div>
				</div>
			</aside>
		</>
	);
}
