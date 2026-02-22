import { z } from "zod";
import type { MemberColorKey } from "@/shared/lib/design-tokens";

export const clipSchema = z.object({
	id: z.string(),
	title: z.string(),
	memberId: z.custom<MemberColorKey>(),
	duration: z.number().int().nonnegative(),
	likeCount: z.number().int().nonnegative(),
	createdAt: z.string().date(),
	audioUrl: z.string().url(),
});

export type Clip = z.infer<typeof clipSchema>;

export const playlistSchema = z.object({
	id: z.string(),
	title: z.string(),
	clipIds: z.array(z.string()),
	createdAt: z.string().date(),
});

export type Playlist = z.infer<typeof playlistSchema>;
