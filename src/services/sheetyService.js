/**
 * Sheety API Service (Direct Google Sheet Persistence)
 * Endpoint: https://api.sheety.co/cdc4bd0f863be78dfb7d6f3223bcd46c/academy/events
 */

import { getDisplayDates } from '../utils/dateUtils';

export const DEFAULT_SHEETY_URL = 'https://api.sheety.co/cdc4bd0f863be78dfb7d6f3223bcd46c/academy/events';

export async function fetchEventsFromSheety(url = DEFAULT_SHEETY_URL) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 500 || (data.errors && data.errors[0]?.detail?.includes('Cannot read property'))) {
        throw new Error("Google Sheet is blank. Add column headers to Row 1 of your 'events' sheet tab!");
      }
      throw new Error(`Sheety error HTTP ${res.status}: ${data.errors?.[0]?.detail || 'API error'}`);
    }

    const rawEvents = data.events || data.sheet1 || [];
    return rawEvents.map(row => mapSheetyRowToEvent(row));
  } catch (err) {
    console.error('Fetch Sheety Error:', err);
    throw err;
  }
}

export async function createSheetyEvent(url = DEFAULT_SHEETY_URL, eventData) {
  try {
    const payload = {
      event: mapEventToSheetyRow(eventData)
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.errors?.[0]?.detail || `Sheety POST failed with HTTP ${res.status}`);
    }

    return data.event ? mapSheetyRowToEvent(data.event) : eventData;
  } catch (err) {
    console.error('Create Sheety Error:', err);
    throw err;
  }
}

export async function updateSheetyEvent(url = DEFAULT_SHEETY_URL, sheetyRowId, eventData) {
  let rowId = sheetyRowId || eventData.sheetyRowId;
  if (!rowId && typeof eventData.id === 'number') {
    rowId = eventData.id;
  }
  if (!rowId && typeof eventData.id === 'string' && eventData.id.startsWith('sheety-')) {
    rowId = eventData.id.replace('sheety-', '');
  }

  if (!rowId) {
    return createSheetyEvent(url, eventData);
  }

  try {
    const updateUrl = `${url}/${rowId}`;
    const payload = {
      event: mapEventToSheetyRow(eventData)
    };

    const res = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.errors?.[0]?.detail || `Sheety PUT failed with HTTP ${res.status}`);
    }

    return data.event ? mapSheetyRowToEvent(data.event) : eventData;
  } catch (err) {
    console.error('Update Sheety Error:', err);
    throw err;
  }
}

export async function deleteSheetyEvent(url = DEFAULT_SHEETY_URL, sheetyRowId) {
  if (!sheetyRowId) return true;

  try {
    const deleteUrl = `${url}/${sheetyRowId}`;
    const res = await fetch(deleteUrl, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    console.error('Delete Sheety Error:', err);
    throw err;
  }
}

export function mapSheetyRowToEvent(row) {
  const eventObj = {
    id: row.id ? `sheety-${row.id}` : `evt-${Date.now()}`,
    sheetyRowId: row.id,
    name: row.name || 'Untitled Event',
    location: row.location || '',
    venue: row.venue || '',
    startDate: row.startDate || '',
    endDate: row.endDate || '',
    displayDates: row.displayDates || '',
    category: row.category || 'Regular Tournament',
    requiresQualification: String(row.requiresQualification).toLowerCase() === 'true',
    notes: row.notes || '',

    hotelStatus: row.hotelStatus || 'not_started',
    hotelEmailDate: row.hotelEmailDate || '',
    hotelDeadline: row.hotelDeadline || '',
    hotelBookingCode: row.hotelBookingCode || '',
    hotelBookingUrl: row.hotelBookingUrl || '',
    hotelName: row.hotelName || '',
    hotelConfirmation: row.hotelConfirmation || '',
    checkInDate: row.checkInDate || '',
    checkOutDate: row.checkOutDate || '',
    hotelCost: row.hotelCost ? String(row.hotelCost) : '',
    hotelDepositPaid: row.hotelDepositPaid ? String(row.hotelDepositPaid) : '',
    hotelBalanceDue: row.hotelBalanceDue ? String(row.hotelBalanceDue) : '',
    hotelPaymentStatus: row.hotelPaymentStatus || 'unpaid',
    hotelNotes: row.hotelNotes || '',

    travelMode: row.travelMode || 'driving',
    flightStatus: row.flightStatus || 'not_needed',
    flightConfirmation: row.flightConfirmation || '',
    flightCost: row.flightCost ? String(row.flightCost) : '',
    travelNotes: row.travelNotes || '',

    checklist: row.checklist ? safeParseJson(row.checklist) : []
  };

  eventObj.displayDates = getDisplayDates(eventObj);
  return eventObj;
}

export function mapEventToSheetyRow(event) {
  return {
    name: event.name || '',
    location: event.location || '',
    venue: event.venue || '',
    startDate: event.startDate || '',
    endDate: event.endDate || '',
    displayDates: event.displayDates || '',
    category: event.category || 'Regular Tournament',
    requiresQualification: event.requiresQualification ? 'true' : 'false',
    notes: event.notes || '',

    hotelStatus: event.hotelStatus || 'not_started',
    hotelEmailDate: event.hotelEmailDate || '',
    hotelDeadline: event.hotelDeadline || '',
    hotelBookingCode: event.hotelBookingCode || '',
    hotelBookingUrl: event.hotelBookingUrl || '',
    hotelName: event.hotelName || '',
    hotelConfirmation: event.hotelConfirmation || '',
    checkInDate: event.checkInDate || '',
    checkOutDate: event.checkOutDate || '',
    hotelCost: event.hotelCost ? String(event.hotelCost) : '',
    hotelDepositPaid: event.hotelDepositPaid ? String(event.hotelDepositPaid) : '',
    hotelBalanceDue: event.hotelBalanceDue ? String(event.hotelBalanceDue) : '',
    hotelPaymentStatus: event.hotelPaymentStatus || 'unpaid',
    hotelNotes: event.hotelNotes || '',

    travelMode: event.travelMode || 'driving',
    flightStatus: event.flightStatus || 'not_needed',
    flightConfirmation: event.flightConfirmation || '',
    flightCost: event.flightCost ? String(event.flightCost) : '',
    travelNotes: event.travelNotes || '',

    checklist: JSON.stringify(event.checklist || [])
  };
}

function safeParseJson(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return [];
  }
}
