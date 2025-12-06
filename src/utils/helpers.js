import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date, format = 'MMM DD, YYYY') => {
  return dayjs(date).format(format);
};

export const formatTime = (date, format = 'HH:mm') => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date) => {
  return dayjs(date).format('MMM DD, YYYY HH:mm');
};

export const getRelativeTime = (date) => {
  return dayjs(date).fromNow();
};

export const isToday = (date) => {
  return dayjs(date).isSame(dayjs(), 'day');
};

export const isThisWeek = (date) => {
  return dayjs(date).isSame(dayjs(), 'week');
};

export const isThisMonth = (date) => {
  return dayjs(date).isSame(dayjs(), 'month');
};

export const getStartOfDay = (date = new Date()) => {
  return dayjs(date).startOf('day').toDate();
};

export const getEndOfDay = (date = new Date()) => {
  return dayjs(date).endOf('day').toDate();
};

export const getStartOfWeek = (date = new Date()) => {
  return dayjs(date).startOf('week').toDate();
};

export const getEndOfWeek = (date = new Date()) => {
  return dayjs(date).endOf('week').toDate();
};

export const calculateStreak = (logs) => {
  if (!logs || logs.length === 0) return 0;
  
  const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  let streak = 0;
  let currentDate = dayjs().startOf('day');
  
  for (const log of sortedLogs) {
    const logDate = dayjs(log.timestamp).startOf('day');
    const daysDiff = currentDate.diff(logDate, 'day');
    
    if (daysDiff === streak) {
      streak++;
      currentDate = logDate.subtract(1, 'day');
    } else {
      break;
    }
  }
  
  return streak;
};

export const calculateTotalPuffs = (logs) => {
  return logs.reduce((total, log) => total + (log.puffCount || 0), 0);
};

export const groupLogsByDay = (logs) => {
  const grouped = {};
  logs.forEach(log => {
    const dateKey = dayjs(log.timestamp).format('YYYY-MM-DD');
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(log);
  });
  return grouped;
};

export const groupLogsByHour = (logs) => {
  const grouped = Array(24).fill(0);
  logs.forEach(log => {
    const hour = dayjs(log.timestamp).hour();
    grouped[hour] += log.puffCount || 0;
  });
  return grouped;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

