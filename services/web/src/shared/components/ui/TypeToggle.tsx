import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const typeToggleVariants = cva(
	[
		"flex-1 font-body text-[0.78rem] font-medium py-2 px-3",
		"rounded-md border-[1.5px] text-center",
		"transition-all duration-[var(--dur-fast)] ease-[var(--ease)]",
		"focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]",
	],
	{
		variants: {
			videoType: {
				stream: "",
				clip: "",
			},
			isActive: {
				true: "",
				false:
					"bg-background text-ink-soft border-border-strong hover:border-ink-muted",
			},
		},
		compoundVariants: [
			{
				videoType: "stream",
				isActive: true,
				className: "bg-[rgb(63_122_87_/_0.12)] border-success text-[#2a6b42]",
			},
			{
				videoType: "clip",
				isActive: true,
				className: "bg-[var(--accent-alpha-12)] border-accent text-accent-text",
			},
		],
		defaultVariants: {
			isActive: false,
		},
	},
);

type TypeToggleProps = Omit<
	VariantProps<typeof typeToggleVariants>,
	"isActive"
> & {
	videoType: "stream" | "clip";
	label: string;
	isActive?: boolean;
	onClick?: () => void;
};

export function TypeToggle({
	videoType,
	label,
	isActive = false,
	onClick,
}: TypeToggleProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(typeToggleVariants({ videoType, isActive }))}
		>
			{label}
		</button>
	);
}
