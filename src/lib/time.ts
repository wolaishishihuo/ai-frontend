import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

// 配置 dayjs
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/**
 * 时间相关的工具函数
 */

/**
 * 格式化相对时间
 * @param date 日期字符串或 Date 对象
 * @returns 相对时间字符串，如 "刚刚"、"2小时前"、"3天前" 等
 */
export function formatRelativeTime(date: string | Date): string {
  const targetDate = dayjs(date);
  const now = dayjs();

  // 小于7天，使用相对时间
  const diffInDays = now.diff(targetDate, 'day');
  if (diffInDays < 7) {
    // 使用 fromNow 获取相对时间，dayjs 会自动处理中文格式
    const relative = targetDate.fromNow();
    // dayjs 的 fromNow 会返回 "几秒前"、"几分钟前" 等，但我们需要 "刚刚"
    const diffInSeconds = now.diff(targetDate, 'second');
    if (diffInSeconds < 60) {
      return '刚刚';
    }
    return relative;
  }

  // 超过7天，显示具体日期
  const currentYear = now.year();
  const targetYear = targetDate.year();

  if (targetYear === currentYear) {
    return targetDate.format('M月D日');
  }

  return targetDate.format('YYYY年M月D日');
}
