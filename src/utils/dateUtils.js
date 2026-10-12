/**
 * Utility functions for date formatting and fallbacks
 */

import { INITIAL_EVENTS } from '../data/initialEvents';

export function getDisplayDates(event) {
  if (event.displayDates && event.displayDates.trim()) {
    return event.displayDates;
  }

  // Fallback to initial events lookup by name
  const match = INITIAL_EVENTS.find(e => e.name.toLowerCase() === (event.name || '').toLowerCase());
  if (match && match.displayDates) {
    return match.displayDates;
  }

  if (event.startDate) {
    return formatDateRange(event.startDate, event.endDate);
  }

  return 'Dates TBD';
}

export function formatDateRange(startDateStr, endDateStr) {
  if (!startDateStr) return 'Dates TBD';

  try {
    const start = new Date(startDateStr + 'T00:00:00');
    if (isNaN(start.getTime())) return startDateStr;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[start.getMonth()];
    const startDay = start.getDate();
    const year = start.getFullYear();

    if (!endDateStr) {
      return `${month} ${startDay}, ${year}`;
    }

    const end = new Date(endDateStr + 'T00:00:00');
    if (isNaN(end.getTime())) {
      return `${month} ${startDay}, ${year}`;
    }

    const endDay = end.getDate();
    if (start.getMonth() === end.getMonth()) {
      return `${month} ${startDay}–${endDay}, ${year}`;
    } else {
      const endMonth = monthNames[end.getMonth()];
      return `${month} ${startDay} – ${endMonth} ${endDay}, ${year}`;
    }
  } catch (e) {
    return startDateStr;
  }
}
