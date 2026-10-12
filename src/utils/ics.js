/**
 * Generates an iCalendar (.ics) format file string for calendar export
 */
export function generateICS(events) {
  let icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Volleyball Travel Season Tracker//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH"
  ];

  events.forEach(event => {
    if (!event.startDate) return;

    const dtStart = formatDateToICS(event.startDate);
    // End date in ICS for all-day events is exclusive (+1 day)
    const dtEnd = event.endDate ? formatDateToICS(addDays(event.endDate, 1)) : dtStart;

    let summary = `Volleyball: ${event.name}`;
    if (event.requiresQualification) summary += " (Requires Qualification)";

    let description = `Category: ${event.category}\\nLocation: ${event.location}`;
    if (event.venue) description += `\\nVenue: ${event.venue}`;
    if (event.hotelName) description += `\\nHotel: ${event.hotelName} (Conf: ${event.hotelConfirmation || 'N/A'})`;
    if (event.hotelDeadline) description += `\\nStay & Play Deadline: ${event.hotelDeadline}`;
    if (event.notes) description += `\\nNotes: ${event.notes}`;

    icsLines.push("BEGIN:VEVENT");
    icsLines.push(`UID:vball-${event.id}-${Date.now()}@volleyballtracker.app`);
    icsLines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`);
    icsLines.push(`DTSTART;VALUE=DATE:${dtStart}`);
    icsLines.push(`DTEND;VALUE=DATE:${dtEnd}`);
    icsLines.push(`SUMMARY:${escapeICS(summary)}`);
    icsLines.push(`LOCATION:${escapeICS(event.location + (event.venue ? ' - ' + event.venue : ''))}`);
    icsLines.push(`DESCRIPTION:${escapeICS(description)}`);
    icsLines.push("END:VEVENT");
  });

  icsLines.push("END:VCALENDAR");
  return icsLines.join("\r\n");
}

function formatDateToICS(dateStr) {
  return dateStr.replace(/-/g, "");
}

function addDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

function escapeICS(str) {
  if (!str) return "";
  return str.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function downloadICS(events, filename = "volleyball_travel_schedule.ics") {
  const content = generateICS(events);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
