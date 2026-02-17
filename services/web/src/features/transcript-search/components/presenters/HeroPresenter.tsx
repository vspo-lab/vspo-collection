import { CheckCircle, LayoutList, Zap } from "lucide-react";
import { Badge } from "@/shared/components/ui/Badge";

export function HeroPresenter() {
	return (
		<section className="relative px-6 pb-7 pt-10 text-center">
			{/* Radial glow background */}
			<div className="pointer-events-none absolute -top-5 left-1/2 h-80 w-80 -translate-x-1/2 bg-[radial-gradient(circle,rgb(230_236_73_/_0.12)_0%,transparent_70%)]" />

			{/* Heading */}
			<h1 className="relative mb-2 text-[2rem] font-bold max-md:text-2xl">
				<span className="relative inline-block">
					あの動画
					<span className="absolute -left-1 -right-1 bottom-1 -z-10 h-2.5 rounded-sm bg-accent opacity-40" />
				</span>
				どこだっけ？
			</h1>

			{/* Subtitle */}
			<p className="mx-auto mb-3.5 max-w-md text-[0.92rem] leading-relaxed text-ink-muted max-md:text-[0.85rem]">
				VTuber配信・切り抜きの文字起こしから、
				<br />
				話題で動画を見つけよう
			</p>

			{/* Feature badges */}
			<div className="flex flex-wrap items-center justify-center gap-2">
				<Badge variant="accent" icon={<CheckCircle />}>
					ブラウザ完結
				</Badge>
				<Badge icon={<LayoutList />}>DuckDB-WASM</Badge>
				<Badge icon={<Zap />}>サーバー不要</Badge>
			</div>
		</section>
	);
}
