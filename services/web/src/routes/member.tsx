import { Avatar } from "@/shared/components/ui/Avatar";
import { members } from "@/shared/lib/members";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/member")({ component: MemberListPage });

function MemberListPage() {
	return (
		<div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
			<h1 className="text-xl font-bold mb-6">Members</h1>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
				{members.map((m) => (
					<Link
						key={m.id}
						to="/member/$memberId"
						params={{ memberId: m.id }}
						className="flex flex-col items-center gap-2 p-4 rounded-lg bg-surface border border-border hover:shadow-[var(--shadow-soft)] transition-shadow"
					>
						<Avatar member={m} size="lg" />
						<span className="text-sm font-medium text-center">{m.name}</span>
					</Link>
				))}
			</div>
		</div>
	);
}
