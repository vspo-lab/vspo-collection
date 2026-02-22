import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Users, Plus, Heart, ListMusic } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Playlist } from "../../types/domain";

const navItems = [
	{ to: "/", icon: Home, label: "Home" },
	{ to: "/member", icon: Users, label: "Member" },
	{ to: "/add", icon: Plus, label: "Add Voice" },
] as const;

type SidebarPresenterProps = {
	playlists?: Playlist[];
};

export function SidebarPresenter({ playlists = [] }: SidebarPresenterProps) {
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;

	return (
		<nav className="flex flex-col h-full py-5 px-4 gap-6 overflow-y-auto">
			<div className="px-2 text-sm font-bold font-display text-ink">
				ぶいすぽコレクション
			</div>

			{/* Main navigation */}
			<ul className="flex flex-col gap-1">
				{navItems.map((item) => {
					const isActive =
						item.to === "/"
							? currentPath === "/"
							: currentPath.startsWith(item.to);
					return (
						<li key={item.to}>
							<Link
								to={item.to}
								className={cn(
									"flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
									"transition-colors duration-[var(--dur-fast)]",
									isActive
										? "bg-accent-bg text-accent"
										: "text-ink-soft hover:bg-surface-warm hover:text-ink",
								)}
							>
								<item.icon size={18} />
								{item.label}
							</Link>
						</li>
					);
				})}
			</ul>

			{/* Playlists section */}
			<div className="flex flex-col gap-2">
				<div className="px-3 text-[0.7rem] font-bold uppercase tracking-wider text-ink-muted">
					Playlists
				</div>
				<ul className="flex flex-col gap-0.5">
					<li>
						<Link
							to="/playlist"
							className={cn(
								"flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm",
								"transition-colors duration-[var(--dur-fast)]",
								currentPath === "/playlist"
									? "bg-accent-bg text-accent"
									: "text-ink-soft hover:bg-surface-warm hover:text-ink",
							)}
						>
							<Heart size={15} />
							お気に入り
						</Link>
					</li>
					{playlists
						.filter((p) => p.id !== "pl-fav")
						.map((pl) => (
							<li key={pl.id}>
								<Link
									to="/playlist"
									className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm text-ink-soft hover:bg-surface-warm hover:text-ink transition-colors duration-[var(--dur-fast)]"
								>
									<ListMusic size={15} />
									{pl.title}
								</Link>
							</li>
						))}
					<li>
						<button
							type="button"
							className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm text-ink-muted hover:text-ink-soft transition-colors duration-[var(--dur-fast)] w-full"
						>
							<Plus size={15} />
							New playlist
						</button>
					</li>
				</ul>
			</div>
		</nav>
	);
}
