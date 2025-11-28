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
  return code.toUpperCase().trim();
}
