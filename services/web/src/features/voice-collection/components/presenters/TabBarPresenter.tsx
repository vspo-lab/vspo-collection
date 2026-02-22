import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Users, ListMusic, Plus } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const tabs = [
	{ to: "/", icon: Home, label: "Home" },
	{ to: "/member", icon: Users, label: "Member" },
	{ to: "/playlist", icon: ListMusic, label: "Playlist" },
	{ to: "/add", icon: Plus, label: "Add" },
] as const;

export function TabBarPresenter() {
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;

	return (
		<nav className="flex items-center justify-around bg-surface border-t border-border px-2 pb-[env(safe-area-inset-bottom)]">
			{tabs.map((tab) => {
				const isActive =
					tab.to === "/"
						? currentPath === "/"
						: currentPath.startsWith(tab.to);
				return (
					<Link
						key={tab.to}
						to={tab.to}
						className={cn(
							"flex flex-col items-center gap-0.5 py-2 px-3 text-[0.65rem]",
							"transition-colors duration-[var(--dur-fast)]",
							isActive ? "text-accent" : "text-ink-muted",
						)}
					>
						<tab.icon size={20} />
						{tab.label}
					</Link>
				);
			})}
		</nav>
	);
}
