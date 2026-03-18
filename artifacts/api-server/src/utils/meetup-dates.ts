function getUpcomingFirstWednesdays(count: number): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  while (dates.length < count) {
    const firstDay = new Date(year, month, 1);
    const dayOfWeek = firstDay.getDay();
    const wednesdayOffset = (3 - dayOfWeek + 7) % 7;
    const firstWednesday = new Date(year, month, 1 + wednesdayOffset);

    if (firstWednesday >= now || firstWednesday.toDateString() === now.toDateString()) {
      dates.push(firstWednesday);
    }

    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
  }

  return dates;
}

function formatDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getUpcomingMeetupDateStrings(count: number): string[] {
  return getUpcomingFirstWednesdays(count).map(formatDateString);
}

export function getBaselineAttendance(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = hash + dateStr.charCodeAt(i);
  }
  return 5 + (hash % 3);
}

export { getUpcomingFirstWednesdays, formatDateString };
