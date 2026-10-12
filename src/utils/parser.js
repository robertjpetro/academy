/**
 * Parses raw email or text string to extract hotel codes, confirmation numbers, 
 * hotel names, flight numbers, and dates.
 */
export function parseTravelText(text) {
  if (!text) return {};

  const extracted = {};

  // Extract confirmation / code numbers (e.g. Code: ABC123XYZ, Confirmation # 849204)
  const confirmMatch = text.match(/(?:confirmation|code|passcode|group code|ref|record locator|PNR)[\s#:]+([A-Z0-9]{4,10})/i);
  if (confirmMatch) {
    extracted.confirmation = confirmMatch[1].toUpperCase();
  }

  // Extract hotel name (e.g. Hotel: Embassy Suites by Hilton, Booked at Marriott)
  const hotelMatch = text.match(/(?:hotel|property|stay|lodging)[\s#:]+([A-Za-z0-9\s,'-]{4,40})(?:\n|\.|$|,|code|deadline)/i);
  if (hotelMatch) {
    extracted.hotelName = hotelMatch[1].trim();
  }

  // Extract dates (e.g., Deadline: 11/15/2026 or 2026-11-15 or Nov 15, 2026)
  const deadlineMatch = text.match(/(?:deadline|cutoff|book by|due date|expires)[\s#:]+([A-Za-z0-9/,\s-]{5,20})/i);
  if (deadlineMatch) {
    const rawDateStr = deadlineMatch[1].trim();
    const parsedDate = parseDateToIso(rawDateStr);
    if (parsedDate) {
      extracted.deadline = parsedDate;
    }
  }

  // Extract URL links (e.g. https://...)
  const urlMatch = text.match(/https?:\/\/[^\s<"']+/i);
  if (urlMatch) {
    extracted.bookingUrl = urlMatch[0];
  }

  // Extract Airline / Flight info (e.g., Delta 1420, AA 512, United 902)
  const flightMatch = text.match(/(?:flight|airline)[\s#:]*([A-Za-z]+\s*#?\d{2,4})/i) || text.match(/\b(American|Delta|United|Southwest|JetBlue|Spirit|Alaska|Frontier)\s*#?\s*(\d{2,4})\b/i);
  if (flightMatch) {
    extracted.flightInfo = flightMatch[0].trim();
  }

  // Extract Cost / Rate (e.g. $189/night, Total $450)
  const costMatch = text.match(/\$\s*(\d+(?:\.\d{2})?)/);
  if (costMatch) {
    extracted.cost = costMatch[1];
  }

  return extracted;
}

function parseDateToIso(dateStr) {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {
    // fallback
  }
  return '';
}
