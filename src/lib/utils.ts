import { format } from "date-fns";
import { th } from "date-fns/locale";

export function formatDateThai(date: Date): string {
  return format(date, "EEEE'ที่' d MMMM yyyy", { locale: th });
}

export function formatDateShort(date: Date): string {
  return format(date, "d MMM", { locale: th });
}

export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy", { locale: th });
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function validateTeamCode(code: string): boolean {
  // 4-10 characters, alphanumeric only
  const regex = /^[A-Za-z0-9]{4,10}$/;
  return regex.test(code);
}

export function normalizeTeamCode(code: string): string {
  // Remove all non-alphanumeric characters, then uppercase
  return code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

// Member color palette - 12 colors for team members
export const MEMBER_COLORS = [
  { id: "blue", name: "ฟ้า", bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200", dot: "bg-blue-500" },
  { id: "green", name: "เขียว", bg: "bg-emerald-100", text: "text-emerald-600", border: "border-emerald-200", dot: "bg-emerald-500" },
  { id: "purple", name: "ม่วง", bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200", dot: "bg-purple-500" },
  { id: "pink", name: "ชมพู", bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-200", dot: "bg-pink-500" },
  { id: "orange", name: "ส้ม", bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200", dot: "bg-orange-500" },
  { id: "teal", name: "เขียวน้ำทะเล", bg: "bg-teal-100", text: "text-teal-600", border: "border-teal-200", dot: "bg-teal-500" },
  { id: "red", name: "แดง", bg: "bg-red-100", text: "text-red-600", border: "border-red-200", dot: "bg-red-500" },
  { id: "yellow", name: "เหลือง", bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200", dot: "bg-amber-500" },
  { id: "indigo", name: "คราม", bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-200", dot: "bg-indigo-500" },
  { id: "cyan", name: "ฟ้าอ่อน", bg: "bg-cyan-100", text: "text-cyan-600", border: "border-cyan-200", dot: "bg-cyan-500" },
  { id: "lime", name: "เขียวมะนาว", bg: "bg-lime-100", text: "text-lime-600", border: "border-lime-200", dot: "bg-lime-500" },
  { id: "rose", name: "กุหลาบ", bg: "bg-rose-100", text: "text-rose-600", border: "border-rose-200", dot: "bg-rose-500" },
] as const;

export type MemberColor = typeof MEMBER_COLORS[number]["id"];

export function getMemberColor(colorId: string) {
  return MEMBER_COLORS.find(c => c.id === colorId) || MEMBER_COLORS[0];
}
