import { type MemberColorKey, memberColors } from "./design-tokens";

export type Member = {
	id: MemberColorKey;
	name: string;
	initial: string;
	color: string;
	avatarTextColor: "light" | "dark";
};

/**
 * All Vspo members with display info.
 * Avatar text color follows the OKLch lightness rule from colors.md:
 * L > 0.7 → dark text, L <= 0.7 → light text.
 */
export const members: Member[] = [
	// JP Members
	{ id: "sumire", name: "花芽すみれ", initial: "す", color: memberColors.sumire, avatarTextColor: "dark" },
	{ id: "nazuna", name: "花芽なずな", initial: "な", color: memberColors.nazuna, avatarTextColor: "dark" },
	{ id: "toto", name: "小雀とと", initial: "と", color: memberColors.toto, avatarTextColor: "dark" },
	{ id: "uruha", name: "一ノ瀬うるは", initial: "う", color: memberColors.uruha, avatarTextColor: "light" },
	{ id: "noa", name: "胡桃のあ", initial: "の", color: memberColors.noa, avatarTextColor: "dark" },
	{ id: "mimi", name: "兎咲ミミ", initial: "ミ", color: memberColors.mimi, avatarTextColor: "dark" },
	{ id: "sena", name: "空澄セナ", initial: "セ", color: memberColors.sena, avatarTextColor: "dark" },
	{ id: "hinano", name: "橘ひなの", initial: "ひ", color: memberColors.hinano, avatarTextColor: "dark" },
	{ id: "lisa", name: "英リサ", initial: "リ", color: memberColors.lisa, avatarTextColor: "dark" },
	{ id: "ren", name: "如月れん", initial: "れ", color: memberColors.ren, avatarTextColor: "light" },
	{ id: "kyupi", name: "神成きゅぴ", initial: "き", color: memberColors.kyupi, avatarTextColor: "dark" },
	{ id: "beni", name: "八雲べに", initial: "べ", color: memberColors.beni, avatarTextColor: "dark" },
	{ id: "emma", name: "藍沢エマ", initial: "エ", color: memberColors.emma, avatarTextColor: "dark" },
	{ id: "runa", name: "紫宮るな", initial: "る", color: memberColors.runa, avatarTextColor: "light" },
	{ id: "tsuna", name: "綾瀬つな", initial: "つ", color: memberColors.tsuna, avatarTextColor: "light" },
	{ id: "ramune", name: "白波らむね", initial: "ら", color: memberColors.ramune, avatarTextColor: "dark" },
	{ id: "met", name: "小森めと", initial: "め", color: memberColors.met, avatarTextColor: "light" },
	{ id: "akari", name: "花鋏キョウ", initial: "キ", color: memberColors.akari, avatarTextColor: "dark" },
	{ id: "kuromu", name: "夜乃くろむ", initial: "く", color: memberColors.kuromu, avatarTextColor: "dark" },
	{ id: "kokage", name: "小柳こかげ", initial: "こ", color: memberColors.kokage, avatarTextColor: "light" },
	{ id: "yuuhi", name: "木暮ゆうひ", initial: "ゆ", color: memberColors.yuuhi, avatarTextColor: "light" },
	{ id: "hanabi", name: "夢野はなび", initial: "は", color: memberColors.hanabi, avatarTextColor: "light" },
	{ id: "moka", name: "甘城もか", initial: "も", color: memberColors.moka, avatarTextColor: "dark" },
	{ id: "seine", name: "瀬名セイネ", initial: "瀬", color: memberColors.seine, avatarTextColor: "light" },
	{ id: "chise", name: "千草ちせ", initial: "ち", color: memberColors.chise, avatarTextColor: "dark" },
	// EN Members
	{ id: "remia", name: "Remia", initial: "R", color: memberColors.remia, avatarTextColor: "light" },
	{ id: "arya", name: "Arya", initial: "A", color: memberColors.arya, avatarTextColor: "light" },
	{ id: "jira", name: "Jira", initial: "J", color: memberColors.jira, avatarTextColor: "light" },
	{ id: "narin", name: "Narin", initial: "N", color: memberColors.narin, avatarTextColor: "dark" },
	{ id: "riko", name: "Riko", initial: "R", color: memberColors.riko, avatarTextColor: "light" },
	{ id: "eris", name: "Eris", initial: "E", color: memberColors.eris, avatarTextColor: "dark" },
];

export function getMemberById(id: MemberColorKey): Member | undefined {
	return members.find((m) => m.id === id);
}
