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
				className: "bg-[rgb(151_213_217_/_0.15)] border-mint text-[#2a7a7e]",
			},
			{
				videoType: "clip",
				isActive: true,
				className: "bg-[rgb(131_168_249_/_0.15)] border-blue text-[#3d5fb3]",
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
