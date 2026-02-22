import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

type LikeButtonProps = {
	isLiked: boolean;
	count?: number;
	onToggle: () => void;
	className?: string;
};

export function LikeButton({ isLiked, count, onToggle, className }: LikeButtonProps) {
	return (
		<button
			type="button"
			onClick={onToggle}
			className={cn(
				"inline-flex items-center gap-1 text-xs select-none",
				"transition-colors duration-[var(--dur-fast)]",
				isLiked ? "text-like" : "text-ink-faint hover:text-like",
				className,
			)}
			aria-label={isLiked ? "Unlike" : "Like"}
		>
			<motion.span
				whileTap={{ scale: 1.3 }}
				transition={{ type: "spring", stiffness: 500, damping: 15 }}
				className="inline-flex"
			>
				<Heart
					size={16}
					fill={isLiked ? "currentColor" : "none"}
					strokeWidth={isLiked ? 0 : 2}
				/>
			</motion.span>
			{count !== undefined && <span>{count}</span>}
		</button>
	);
}
