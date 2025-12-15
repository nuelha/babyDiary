import { differenceInDays, differenceInMonths, differenceInYears, format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export const getAgeString = (birthDateStr: string): string => {
  const birthDate = parseISO(birthDateStr);
  const today = new Date();

  const years = differenceInYears(today, birthDate);
  const months = differenceInMonths(today, birthDate) % 12;
  const days = differenceInDays(today, birthDate);

  if (days < 30) return `${days}일`;
  if (years === 0) return `${months}개월`;
  return `${years}세 ${months}개월 (${days}일)`;
};

export const getDDay = (birthDateStr: string): string => {
  const birthDate = parseISO(birthDateStr);
  const today = new Date();
  const days = differenceInDays(today, birthDate);
  return `D+${days + 1}`; // D+1 represents the birth day itself usually
};

export const getMonthDifference = (birthDateStr: string): number => {
    return differenceInMonths(new Date(), parseISO(birthDateStr));
}

export const formatDateKorean = (date: Date): string => {
  return format(date, 'yyyy년 M월 d일 EEEE', { locale: ko });
};

export const formatMonthYear = (date: Date): string => {
  return format(date, 'yyyy년 M월', { locale: ko });
};