import { Avatar } from "@/shared/components/ui/Avatar";
import type { MemberColorKey } from "@/shared/lib/design-tokens";
import { members } from "@/shared/lib/members";
import { getMemberById } from "@/shared/lib/members";
import { cn } from "@/shared/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/add")({ component: AddVoicePage });

function AddVoicePage() {
	const [url, setUrl] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [selectedMemberId, setSelectedMemberId] = useState<MemberColorKey | "">(
		"",
	);
	const [title, setTitle] = useState("");

	const selectedMember = selectedMemberId
		? getMemberById(selectedMemberId)
		: null;
	const hasDuration = startTime && endTime;

	return (
		<div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
			<h1 className="text-xl font-bold mb-6">Add Voice Clip</h1>

			<div className="flex flex-col md:flex-row gap-6">
				{/* Form */}
				<div className="flex-1 flex flex-col gap-5">
					{/* Source tabs */}
					<div className="flex gap-2 border-b border-border pb-3">
						<button
							type="button"
							className="text-sm font-medium text-accent border-b-2 border-accent pb-1"
						>
							YouTube URL
						</button>
						<button
							type="button"
							className="text-sm font-medium text-ink-muted pb-1"
						>
							File Upload
						</button>
					</div>

					{/* URL input */}
					<div>
						<label
							htmlFor="add-url"
							className="block text-sm font-medium mb-1.5"
						>
							YouTube URL
						</label>
						<input
							id="add-url"
							type="url"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="https://youtube.com/watch?v=..."
							className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface focus:outline-2 focus:outline-accent"
						/>
					</div>

					{/* Time range */}
					<div className="flex gap-4">
						<div className="flex-1">
							<label
								htmlFor="add-start"
								className="block text-sm font-medium mb-1.5"
							>
								Start
							</label>
							<input
								id="add-start"
								type="text"
								value={startTime}
								onChange={(e) => setStartTime(e.target.value)}
								placeholder="0:00:00"
								className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface focus:outline-2 focus:outline-accent tabular-nums"
							/>
						</div>
						<div className="flex-1">
							<label
								htmlFor="add-end"
								className="block text-sm font-medium mb-1.5"
							>
								End
							</label>
							<input
								id="add-end"
								type="text"
								value={endTime}
								onChange={(e) => setEndTime(e.target.value)}
								placeholder="0:00:05"
								className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface focus:outline-2 focus:outline-accent tabular-nums"
							/>
						</div>
					</div>

					{/* Member dropdown */}
					<div>
						<label
							htmlFor="add-member"
							className="block text-sm font-medium mb-1.5"
						>
							Member
						</label>
						<select
							id="add-member"
							value={selectedMemberId}
							onChange={(e) =>
								setSelectedMemberId(e.target.value as MemberColorKey)
							}
							className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface focus:outline-2 focus:outline-accent"
						>
							<option value="">Select member...</option>
							{members.map((m) => (
								<option key={m.id} value={m.id}>
									{m.name}
								</option>
							))}
						</select>
					</div>

					{/* Title */}
					<div>
						<label
							htmlFor="add-title"
							className="block text-sm font-medium mb-1.5"
						>
							Title
						</label>
						<div className="relative">
							<input
								id="add-title"
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value.slice(0, 50))}
								placeholder="e.g. ないないないない！"
								maxLength={50}
								className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface focus:outline-2 focus:outline-accent"
							/>
							<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-muted">
								{title.length}/50
							</span>
						</div>
					</div>

					<button
						type="button"
						className={cn(
							"w-full py-2.5 text-sm font-medium rounded-md transition-colors",
							url && title && selectedMemberId
								? "bg-accent text-white hover:bg-accent-hover"
								: "bg-border text-ink-muted cursor-not-allowed",
						)}
						disabled={!url || !title || !selectedMemberId}
					>
						Submit Clip
					</button>
				</div>

				{/* Preview panel (desktop) */}
				<div className="hidden md:block w-[300px] shrink-0">
					<div className="sticky top-6 flex flex-col gap-4">
						{/* Preview card */}
						<div className="rounded-lg border border-border bg-surface p-5">
							<div className="text-xs text-ink-muted mb-3 font-medium">
								Preview
							</div>
							<div className="flex items-center gap-3">
								{selectedMember ? (
									<Avatar member={selectedMember} size="md" />
								) : (
									<div className="w-11 h-11 rounded-full bg-border" />
								)}
								<div className="flex-1 min-w-0">
									<div className="text-sm font-medium truncate">
										{title || "Clip title"}
									</div>
									<div className="text-xs text-ink-muted">
										{selectedMember?.name ?? "Member"}
									</div>
								</div>
								<button
									type="button"
									className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center"
									aria-label="Play preview"
								>
									<Play size={14} className="ml-0.5" />
								</button>
							</div>
							{hasDuration && (
								<div className="mt-3 text-xs text-ink-muted">
									Duration: {startTime} - {endTime}
								</div>
							)}
						</div>

						{/* Tips card */}
						<div className="rounded-lg border border-border bg-accent-bg p-5 text-sm">
							<div className="font-medium mb-2">Tips</div>
							<ul className="list-disc list-inside text-ink-soft text-xs space-y-1.5">
								<li>Use timestamps from the YouTube video</li>
								<li>Keep clips under 30 seconds</li>
								<li>Add a descriptive title for easy search</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
