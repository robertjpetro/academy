import React, { useState } from 'react';
import { X, Zap, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { parseTravelText } from '../utils/parser';

export function EmailParserModal({ events, onClose, onApplyParsedData }) {
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [emailText, setEmailText] = useState('');
  const [parsedResults, setParsedResults] = useState(null);

  const handleParse = () => {
    if (!emailText.trim()) return;
    const extracted = parseTravelText(emailText);
    setParsedResults(extracted);
  };

  const handleApply = () => {
    if (!selectedEventId || !parsedResults) return;
    onApplyParsedData(selectedEventId, parsedResults);
    onClose();
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={22} color="var(--primary)" />
            <h2>Smart Email Quick-Parser</h2>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Paste the Stay & Play notification email or hotel/flight confirmation text below. 
          The app will auto-extract group codes, deadlines, hotel names, links, and confirmations!
        </p>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Select Tournament Event</label>
          <select 
            className="form-input" 
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
          >
            {events.map(evt => (
              <option key={evt.id} value={evt.id}>
                {evt.name} ({evt.displayDates} - {evt.location})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Paste Email Content</label>
          <textarea 
            className="form-input"
            style={{ minHeight: '140px', fontFamily: 'monospace', fontSize: '0.85rem' }}
            placeholder={`Example email text:
Stay & Play for Big South is now open! 
Group Passcode: VOLLEY2027
Book before deadline: 11/25/2026
Portal Link: https://thsweb.com/booking/12345
Hotel: Embassy Suites Atlanta Downtown
Confirmation #: 984920`}
            value={emailText}
            onChange={e => setEmailText(e.target.value)}
          />
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleParse} 
          style={{ width: '100%', justifyContent: 'center', marginBottom: '1.25rem' }}
        >
          <Zap size={16} />
          Parse Email Text
        </button>

        {parsedResults && (
          <div style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--primary)', 
            borderRadius: 'var(--radius-md)', 
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Check size={16} /> Extracted Travel Information:
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div>
                <strong>Confirmation / Code:</strong> {parsedResults.confirmation || <em>Not found</em>}
              </div>
              <div>
                <strong>Hotel Name:</strong> {parsedResults.hotelName || <em>Not found</em>}
              </div>
              <div>
                <strong>Deadline Date:</strong> {parsedResults.deadline || <em>Not found</em>}
              </div>
              <div>
                <strong>Flight Info:</strong> {parsedResults.flightInfo || <em>Not found</em>}
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Booking Link:</strong> {parsedResults.bookingUrl || <em>Not found</em>}
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary btn-sm" onClick={handleApply}>
                Apply Extracted Info to {selectedEvent?.name}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
