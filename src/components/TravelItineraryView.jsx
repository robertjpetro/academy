import React from 'react';
import { Building2, Plane, Car, Printer, FileText, CheckCircle2, CreditCard, Wallet } from 'lucide-react';

export function TravelItineraryView({ events, onEditEvent }) {
  const totalHotelCost = events.reduce((acc, e) => acc + (parseFloat(e.hotelCost) || 0), 0);
  const totalFlightCost = events.reduce((acc, e) => acc + (parseFloat(e.flightCost) || 0), 0);
  const totalSpend = totalHotelCost + totalFlightCost;

  const totalDepositsPaid = events.reduce((acc, e) => acc + (parseFloat(e.hotelDepositPaid) || 0), 0);
  const totalBalancesDue = events.reduce((acc, e) => acc + (parseFloat(e.hotelBalanceDue) || 0), 0);

  return (
    <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>2027 Season Master Travel & Deposit Itinerary</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Complete printable breakdown of all hotel bookings, deposit payments, check-in balances due, and flight schedules.
          </p>
        </div>

        <button className="btn btn-outline btn-sm no-print" onClick={() => window.print()}>
          <Printer size={16} /> Print Itinerary
        </button>
      </div>

      {/* Responsive Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-input)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Tournament & Location</th>
              <th style={{ padding: '0.75rem 1rem' }}>Dates</th>
              <th style={{ padding: '0.75rem 1rem' }}>Stay & Play Hotel</th>
              <th style={{ padding: '0.75rem 1rem' }}>Check In / Out</th>
              <th style={{ padding: '0.75rem 1rem' }}>Deposit Paid</th>
              <th style={{ padding: '0.75rem 1rem' }}>Balance Due at Check-in</th>
              <th style={{ padding: '0.75rem 1rem' }}>Flight / Travel</th>
              <th style={{ padding: '0.75rem 1rem' }}>Total Cost</th>
              <th style={{ padding: '0.75rem 1rem' }} className="no-print">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt, idx) => {
              const depPaid = parseFloat(evt.hotelDepositPaid) || 0;
              const balDue = parseFloat(evt.hotelBalanceDue) || 0;
              const totalCost = (parseFloat(evt.hotelCost) || 0) + (parseFloat(evt.flightCost) || 0);

              return (
                <tr 
                  key={evt.id} 
                  style={{ 
                    borderBottom: '1px solid var(--border-color)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                    <div>{evt.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{evt.location}</div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', color: 'var(--accent-cyan)' }}>
                    {evt.displayDates}
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    {evt.hotelName ? (
                      <div>
                        <strong style={{ color: 'var(--status-booked-text)' }}>{evt.hotelName}</strong>
                        {evt.hotelConfirmation && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Conf: {evt.hotelConfirmation}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--status-pending-text)' }}>
                        {evt.hotelStatus === 'booked' ? 'Hotel Booked (Name TBD)' : '⚠️ Unbooked'}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                    {evt.checkInDate ? `${evt.checkInDate} to ${evt.checkOutDate}` : '—'}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    {depPaid > 0 ? `$${depPaid}` : '—'}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', color: balDue > 0 ? 'var(--status-pending-text)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {balDue > 0 ? `$${balDue}` : '—'}
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    {evt.travelMode === 'flying' ? (
                      <div>
                        <span style={{ color: 'var(--accent-cyan)' }}>✈️ Flight</span>
                        {evt.flightConfirmation && <div>Conf: <code>{evt.flightConfirmation}</code></div>}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>🚗 Driving</span>
                    )}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                    ${totalCost}
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }} className="no-print">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => onEditEvent(evt)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--bg-input)', fontWeight: 700, borderTop: '2px solid var(--border-color)' }}>
              <td colSpan={4} style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Totals:</td>
              <td style={{ padding: '0.85rem 1rem', color: 'var(--accent-emerald)' }}>${totalDepositsPaid.toLocaleString()}</td>
              <td style={{ padding: '0.85rem 1rem', color: 'var(--status-pending-text)' }}>${totalBalancesDue.toLocaleString()}</td>
              <td></td>
              <td colSpan={2} style={{ padding: '0.85rem 1rem', color: 'var(--primary)', fontSize: '1.05rem' }}>
                ${totalSpend.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
