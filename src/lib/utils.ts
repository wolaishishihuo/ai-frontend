import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化相对时间
 * @param date 日期字符串或 Date 对象
 * @returns 相对时间字符串，如 "2小时前"、"昨天"、"3天前" 等
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // 小于1分钟
  if (diffInSeconds < 60) {
    return '刚刚';
  }

  // 小于1小时
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }

  // 小于24小时
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }

  // 小于7天
  if (diffInDays < 7) {
    return `${diffInDays}天前`;
  }

  // 超过7天，显示具体日期
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  const year = targetDate.getFullYear();
  const currentYear = now.getFullYear();

  if (year === currentYear) {
    return `${month}月${day}日`;
  }

  return `${year}年${month}月${day}日`;
}
