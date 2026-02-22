import type { Member } from "@/shared/lib/members";
import { cn } from "@/shared/lib/utils";

const sizeMap = {
	xs: "w-7 h-7 text-[0.65rem]",
	sm: "w-9 h-9 text-xs",
	md: "w-11 h-11 text-sm",
	lg: "w-20 h-20 text-2xl",
	xl: "w-40 h-40 text-5xl",
} as const;

type AvatarProps = {
	member: Member;
	size: keyof typeof sizeMap;
	className?: string;
};

export function Avatar({ member, size, className }: AvatarProps) {
	const needsBorder = member.id === "sena";

	return (
		<div
			className={cn(
				"rounded-full flex items-center justify-center font-bold shrink-0 select-none",
				sizeMap[size],
				needsBorder && "border border-border",
				member.avatarTextColor === "dark" ? "text-ink" : "text-white",
				className,
			)}
			style={{ backgroundColor: member.color }}
			aria-label={member.name}
		>
			{member.initial}
		</div>
	);
}
