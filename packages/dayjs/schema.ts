import { z } from "zod";

export const TargetLangSchema = z.enum([
	"en",
	"ja",
	"fr",
	"de",
	"es",
	"cn",
	"tw",
	"ko",
	"default",
]);

export const LangCodeLabelMapping = {
	en: "English",
	ja: "Japanese",
	fr: "French",
	de: "German",
	es: "Spanish",
	cn: "Chinese (Simplified)",
	tw: "Chinese (Traditional)",
	ko: "Korean",
	default: "Default",
} as const;

export const LabeledTargetLangSchema = TargetLangSchema.transform((lang) => ({
	code: lang,
	label: LangCodeLabelMapping[lang],
}));

export const LOCALE_TIMEZONE_MAP: Record<
	TargetLang,
	{ locale: string; timeZone: string }
> = {
	en: { locale: "en-US", timeZone: "UTC" },
	ja: { locale: "ja-JP", timeZone: "Asia/Tokyo" },
	fr: { locale: "fr-FR", timeZone: "Europe/Paris" },
	de: { locale: "de-DE", timeZone: "Europe/Berlin" },
	es: { locale: "es-ES", timeZone: "Europe/Madrid" },
	cn: { locale: "zh-CN", timeZone: "Asia/Shanghai" },
	tw: { locale: "zh-TW", timeZone: "Asia/Taipei" },
	ko: { locale: "ko-KR", timeZone: "Asia/Seoul" },
	default: { locale: "ja-JP", timeZone: "Asia/Tokyo" },
};

export type TargetLang = z.infer<typeof TargetLangSchema>;

export type LabeledTargetLang = z.infer<typeof LabeledTargetLangSchema>;
