import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GripVertical, X, Download, Save } from "lucide-react";
import { Avatar } from "@/shared/components/ui/Avatar";
import { cn } from "@/shared/lib/utils";
import { formatDuration } from "@/shared/lib/format";
import { getMemberById } from "@/shared/lib/members";
import { mockClips } from "@/features/voice-collection/__mocks__/fixtures";
import type { Clip } from "@/features/voice-collection/types/domain";

export const Route = createFileRoute("/merge")({ component: MergePage });

type Format = "mp3" | "wav" | "ogg";

function MergePage() {
	const [clips, setClips] = useState<Clip[]>(mockClips.slice(0, 5));
	const [format, setFormat] = useState<Format>("mp3");
	const [draggingId, setDraggingId] = useState<string | null>(null);

	const totalDuration = clips.reduce((sum, c) => sum + c.duration, 0);
	const barHeights = useMemo(
		() => Array.from({ length: 32 }, (_, i) => 20 + Math.sin(i * 0.5) * 40 + Math.random() * 20),
		[],
	);

	const removeClip = (id: string) => {
		setClips((prev) => prev.filter((c) => c.id !== id));
	};

	return (
		<div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
			<h1 className="text-xl font-bold mb-6">Merge & Download</h1>

			<div className="flex flex-col md:flex-row gap-6">
				{/* Clip list */}
				<div className="flex-1">
					<div className="flex flex-col gap-0.5">
						{clips.map((clip, i) => {
							const member = getMemberById(clip.memberId);
							if (!member) return null;
							const isDragging = clip.id === draggingId;

							return (
								<div key={clip.id}>
									<div
										className={cn(
											"flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all",
											isDragging
												? "border-accent shadow-[var(--shadow-action)] bg-surface"
												: "border-border bg-surface",
										)}
										draggable
										onDragStart={() => setDraggingId(clip.id)}
										onDragEnd={() => setDraggingId(null)}
									>
										<GripVertical
											size={16}
											className="text-ink-muted cursor-grab shrink-0"
										/>
										<Avatar member={member} size="sm" />
										<div className="flex-1 min-w-0">
											<div className="text-sm font-medium truncate">
												{clip.title}
											</div>
											<div className="text-xs text-ink-muted">
												{member.name}
											</div>
										</div>
										<span className="text-xs text-ink-muted tabular-nums shrink-0">
											{formatDuration(clip.duration)}
										</span>
										<button
											type="button"
											onClick={() => removeClip(clip.id)}
											className="text-ink-muted hover:text-ink-soft p-1 shrink-0"
											aria-label="Remove clip"
										>
											<X size={14} />
										</button>
									</div>
									{/* Connector */}
									{i < clips.length - 1 && (
										<div className="flex justify-center py-0.5">
											<div className="w-px h-3 bg-border" />
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* Preview panel */}
				<div className="md:w-[300px] shrink-0">
					<div className="sticky top-6 flex flex-col gap-4">
						{/* Waveform placeholder */}
						<div className="rounded-lg border border-border bg-surface p-5">
							<div className="text-xs text-ink-muted mb-3 font-medium">
								Merge Preview
							</div>
							<div className="h-16 bg-accent-bg rounded flex items-end justify-center gap-[2px] px-4">
								{barHeights.map((h, i) => (
									<div
										key={i}
										className="w-1 bg-accent rounded-t opacity-60"
										style={{ height: `${h}%` }}
									/>
								))}
							</div>
						</div>

						{/* Total info */}
						<div className="rounded-lg border border-border bg-surface p-4 flex items-center justify-between">
							<span className="text-sm text-ink-soft">
								{clips.length} clips
							</span>
							<span className="text-sm font-medium tabular-nums">
								{formatDuration(totalDuration)}
							</span>
						</div>

						{/* Format selector */}
						<div className="flex gap-2">
							{(["mp3", "wav", "ogg"] as const).map((f) => (
								<button
									key={f}
									type="button"
									onClick={() => setFormat(f)}
									className={cn(
										"flex-1 py-2 text-xs font-medium rounded-md border transition-colors uppercase",
										format === f
											? "border-accent bg-accent-bg text-accent"
											: "border-border text-ink-muted hover:border-ink-muted",
									)}
								>
									{f}
								</button>
							))}
						</div>

						{/* Actions */}
						<button
							type="button"
							className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md bg-accent text-white hover:bg-accent-hover transition-colors"
						>
							<Download size={16} />
							Download
						</button>
						<button
							type="button"
							className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md bg-accent-bg text-accent hover:bg-accent-soft transition-colors"
						>
							<Save size={16} />
							Save as Playlist
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
