import { motion } from "framer-motion";
import { BarChart3, FileSearch, MessageCircle, Share2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/Badge";

const stagger = {
	hidden: {},
	show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
	hidden: { opacity: 0, y: 12 },
	show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 0.68, 0.2, 1] } },
};

export function HeroPresenter() {
	return (
		<section className="relative px-6 pb-7 pt-10 text-center">
			{/* Radial glow background */}
			<div className="pointer-events-none absolute -top-5 left-1/2 h-[420px] w-[420px] -translate-x-1/2 bg-[radial-gradient(circle,rgb(171_125_66_/_0.18)_0%,transparent_70%)]" />

			{/* Frosted panel */}
			<motion.div
				className="relative mx-auto max-w-2xl rounded-2xl border border-[var(--frost-border)] bg-[var(--frost)] px-10 py-8 shadow-[var(--shadow-soft)] backdrop-blur-md"
				variants={stagger}
				initial="hidden"
				animate="show"
			>
				{/* Brand name — large pop gothic */}
				<motion.div
					className="mb-2 font-body text-[clamp(2rem,5vw,3.2rem)] font-bold leading-tight tracking-wide"
					variants={fadeUp}
				>
					ぶいすぽ
					<span className="text-accent">っ!</span>
					サーチ
				</motion.div>

				{/* Tagline */}
				<motion.h1
					className="mb-2 font-display text-[clamp(1.1rem,2vw,1.4rem)] font-semibold text-ink-soft max-md:text-base"
					variants={fadeUp}
				>
					<span className="relative inline-block">
						あの動画
						<span className="absolute -left-1 -right-1 bottom-1 -z-10 h-2.5 rounded-sm bg-accent/20" />
					</span>
					どこだっけ？を、その先まで。
				</motion.h1>

				{/* Subtitle */}
				<motion.p
					className="mx-auto mb-3.5 max-w-lg text-[0.88rem] leading-relaxed text-ink-muted max-md:text-[0.82rem]"
					variants={fadeUp}
				>
					動画検索に加えて、フォローアップ回答生成と横断分析を同じ会話画面で実行
				</motion.p>

				{/* Feature badges */}
				<motion.div
					className="flex flex-wrap items-center justify-center gap-2"
					variants={fadeUp}
				>
					<Badge variant="accent" icon={<FileSearch />}>
						Transcript Search
					</Badge>
					<Badge icon={<Share2 />}>X Signal Retrieval</Badge>
					<Badge icon={<MessageCircle />}>Follow-up Answer</Badge>
					<Badge icon={<BarChart3 />}>Cross Source Analysis</Badge>
				</motion.div>
			</motion.div>
		</section>
	);
}
