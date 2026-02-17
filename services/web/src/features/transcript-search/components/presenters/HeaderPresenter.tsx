import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type HeaderPresenterProps = {
	onFilterToggle?: () => void;
};

export function HeaderPresenter({ onFilterToggle }: HeaderPresenterProps) {
	return (
		<header
			className={cn(
				"sticky top-0 z-50 px-6",
				"border-b border-border",
				"bg-background/85 backdrop-blur-xl",
			)}
		>
			<div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between">
				{/* Brand */}
				<a
					href="/"
					className={cn(
						"flex items-center gap-3 no-underline text-ink",
						"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-4 focus-visible:rounded-sm",
					)}
				>
					<div
						className={cn(
							"relative flex h-9 w-9 items-center justify-center overflow-hidden",
							"rounded-sm bg-accent shadow-[var(--shadow-action)]",
						)}
					>
						<Search className="relative z-10 h-5 w-5 text-ink" />
						<span className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/30" />
					</div>
					<div>
						<span className="block font-display text-[1.15rem] font-bold tracking-wide">
							ぶいすぽサーチ
						</span>
						<span className="-mt-0.5 block text-[0.7rem] font-normal text-ink-muted">
							あの動画どこだっけ？
						</span>
					</div>
				</a>

				{/* Mobile filter toggle */}
				<div className="flex items-center gap-2.5">
					<button
						type="button"
						onClick={onFilterToggle}
						aria-label="フィルターを開く"
						className={cn(
							"flex h-10 w-10 items-center justify-center md:hidden",
							"rounded-sm border border-border bg-surface text-ink-soft",
							"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
							"hover:bg-surface-warm",
							"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]",
						)}
					>
						<SlidersHorizontal className="h-[18px] w-[18px]" />
					</button>
				</div>
			</div>
		</header>
	);
}
