import { Send } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type ChatInputPresenterProps = {
	value: string;
	placeholder?: string;
	onChange?: (value: string) => void;
	onSubmit?: () => void;
	isDisabled?: boolean;
};

export function ChatInputPresenter({
	value,
	placeholder = "キーワードで動画を検索...",
	onChange,
	onSubmit,
	isDisabled = false,
}: ChatInputPresenterProps) {
	return (
		<div>
			<div
				className={cn(
					"flex items-center gap-2.5",
					"rounded-2xl border-[1.5px] border-border-strong bg-surface",
					"py-1.5 pr-1.5 pl-5",
					"shadow-[var(--shadow-card)]",
					"transition-[border-color] duration-[var(--dur-fast)] ease-[var(--ease)]",
					"focus-within:border-ink-muted focus-within:shadow-[var(--shadow-focus)]",
				)}
			>
				<input
					type="text"
					value={value}
					onChange={(e) => onChange?.(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !isDisabled) {
							e.preventDefault();
							onSubmit?.();
						}
					}}
					placeholder={isDisabled ? "準備中..." : placeholder}
					disabled={isDisabled}
					aria-label="検索キーワードを入力"
					className={cn(
						"flex-1 border-0 bg-transparent py-2 font-body text-[0.92rem] text-ink outline-none",
						"placeholder:text-grey",
						"disabled:cursor-not-allowed disabled:opacity-50",
					)}
				/>
				<button
					type="button"
					onClick={onSubmit}
					disabled={isDisabled}
					aria-label="検索"
					className={cn(
						"flex h-11 w-11 shrink-0 items-center justify-center",
						"rounded-full bg-accent text-ink",
						"shadow-[var(--shadow-action)]",
						"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
						"hover:bg-accent-hover hover:scale-105",
						"active:scale-95",
						"disabled:opacity-50 disabled:hover:scale-100",
						"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]",
					)}
				>
					<Send className="ml-0.5 h-[18px] w-[18px]" />
				</button>
			</div>

			{/* Keyboard hints (hidden on mobile) */}
			<div className="mt-2.5 hidden items-center justify-center gap-4 text-[0.7rem] text-ink-muted md:flex">
				<span className="flex items-center gap-1">
					<kbd className="rounded bg-surface px-1.5 py-0.5 font-body text-[0.65rem] border border-border-strong text-ink-muted">
						Enter
					</kbd>{" "}
					で送信
				</span>
				<span>AND / OR で複数キーワード検索</span>
			</div>
		</div>
	);
}
