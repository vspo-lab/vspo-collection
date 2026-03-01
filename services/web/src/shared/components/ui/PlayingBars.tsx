import { cn } from "@/shared/lib/utils";

type PlayingBarsProps = {
	className?: string;
};

export function PlayingBars({ className }: PlayingBarsProps) {
	return (
		<div
			className={cn("flex items-end gap-[2px] h-3.5", className)}
			aria-label="Now playing"
		>
			{[0, 1, 2, 3].map((i) => (
				<span
					key={i}
					className="w-[3px] rounded-full bg-accent animate-[playing-bar_0.8s_ease-in-out_infinite]"
					style={{ animationDelay: `${i * 0.15}s` }}
				/>
			))}
		</div>
	);
}
