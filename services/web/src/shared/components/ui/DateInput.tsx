import { cn } from "@/shared/lib/utils";

type DateInputProps = {
	label: string;
	value: string;
	onChange?: (value: string) => void;
};

export function DateInput({ label, value, onChange }: DateInputProps) {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-[0.7rem] text-ink-muted">{label}</span>
			<input
				type="date"
				value={value}
				onChange={(e) => onChange?.(e.target.value)}
				className={cn(
					"font-body text-[0.8rem] px-2.5 py-[7px]",
					"rounded-sm border border-border-strong bg-background text-ink",
					"outline-none transition-[border-color] duration-[var(--dur-fast)] ease-[var(--ease)]",
					"focus-visible:border-ink focus-visible:shadow-[var(--shadow-focus)]",
				)}
			/>
		</div>
	);
}
