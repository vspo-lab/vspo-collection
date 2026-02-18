import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center gap-1.5 text-[0.72rem] font-medium px-2.5 py-1 rounded-full border transition-colors duration-[var(--dur-fast)] ease-[var(--ease)]",
	{
		variants: {
			variant: {
				default: "bg-surface border-border text-ink-soft",
				accent:
					"bg-[var(--accent-alpha-12)] border-[var(--accent-alpha-30)] text-accent-text",
				youtube:
					"bg-[rgb(196_48_43_/_0.08)] border-[rgb(196_48_43_/_0.25)] text-[#9b2520]",
				x: "bg-[rgb(29_155_240_/_0.08)] border-[rgb(29_155_240_/_0.25)] text-[#1270b0]",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

type BadgeProps = VariantProps<typeof badgeVariants> & {
	icon?: React.ReactNode;
	children: React.ReactNode;
};

export function Badge({ variant, icon, children }: BadgeProps) {
	return (
		<span className={cn(badgeVariants({ variant }))}>
			{icon && <span className="w-3 h-3 [&>svg]:w-3 [&>svg]:h-3">{icon}</span>}
			{children}
		</span>
	);
}
