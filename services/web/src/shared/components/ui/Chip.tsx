import { cn } from "@/shared/lib/utils";

type ChipProps = {
	label: string;
	colorDot?: string;
	isActive?: boolean;
	onClick?: () => void;
};

export function Chip({
	label,
	colorDot,
	isActive = false,
	onClick,
}: ChipProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"inline-flex items-center gap-1.5 text-[0.75rem] px-2.5 py-1.5",
				"rounded-full border font-body select-none",
				"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
				"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]",
				isActive
					? "bg-accent text-white border-accent hover:bg-accent-hover"
					: "bg-background text-ink-soft border-border-strong hover:border-ink-muted hover:bg-surface-warm",
			)}
		>
			{colorDot && (
				<span
					className={cn(
						"w-2 h-2 rounded-full shrink-0",
						isActive ? "border border-white/30" : "border border-black/10",
					)}
					style={{ backgroundColor: colorDot }}
				/>
			)}
			{label}
		</button>
	);
}
