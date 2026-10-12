import React, { useState } from 'react';
import { X, Plus, Trash2, Building2, Plane, Calendar, CheckSquare, DollarSign, Wallet } from 'lucide-react';

export function EventModal({ event, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    id: event?.id || `evt-${Date.now()}`,
    sheetyRowId: event?.sheetyRowId || (typeof event?.id === 'number' ? event.id : null),
    name: event?.name || '',
    location: event?.location || '',
    venue: event?.venue || '',
    startDate: event?.startDate || '',
    endDate: event?.endDate || '',
    displayDates: event?.displayDates || '',
    category: event?.category || 'Regular Tournament',
    requiresQualification: event?.requiresQualification || false,
    notes: event?.notes || '',

    // Hotel
    hotelStatus: event?.hotelStatus || 'not_started',
    hotelEmailDate: event?.hotelEmailDate || '',
    hotelDeadline: event?.hotelDeadline || '',
    hotelBookingCode: event?.hotelBookingCode || '',
    hotelBookingUrl: event?.hotelBookingUrl || '',
    hotelName: event?.hotelName || '',
    hotelConfirmation: event?.hotelConfirmation || '',
    checkInDate: event?.checkInDate || '',
    checkOutDate: event?.checkOutDate || '',
    hotelCost: event?.hotelCost || '',
    hotelDepositPaid: event?.hotelDepositPaid || '',
    hotelBalanceDue: event?.hotelBalanceDue || '',
    hotelPaymentStatus: event?.hotelPaymentStatus || 'unpaid',
    hotelNotes: event?.hotelNotes || '',

    // Travel
    travelMode: event?.travelMode || 'driving',
    flightStatus: event?.flightStatus || 'not_needed',
    flightOutbound: event?.flightOutbound || { airline: '', flightNum: '', date: '', depTime: '', arrTime: '', from: '', to: '' },
    flightReturn: event?.flightReturn || { airline: '', flightNum: '', date: '', depTime: '', arrTime: '', from: '', to: '' },
    flightConfirmation: event?.flightConfirmation || '',
    flightCost: event?.flightCost || '',
    travelNotes: event?.travelNotes || '',

    checklist: event?.checklist || []
  });

  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [activeTab, setActiveTab] = useState('hotel'); // 'hotel' | 'flight' | 'basic' | 'checklist'

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate remaining balance if total cost or deposit is updated
      if (field === 'hotelCost' || field === 'hotelDepositPaid') {
        const cost = parseFloat(field === 'hotelCost' ? value : prev.hotelCost) || 0;
        const deposit = parseFloat(field === 'hotelDepositPaid' ? value : prev.hotelDepositPaid) || 0;
        const balance = Math.max(0, cost - deposit);
        updated.hotelBalanceDue = balance > 0 ? String(balance) : '0';

        if (deposit > 0 && balance > 0) {
          updated.hotelPaymentStatus = 'deposit_paid';
        } else if (deposit > 0 && balance === 0) {
          updated.hotelPaymentStatus = 'fully_paid';
        }
      }
      return updated;
    });
  };

  const handleFlightOutboundChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      flightOutbound: { ...prev.flightOutbound, [field]: value }
    }));
  };

  const handleFlightReturnChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      flightReturn: { ...prev.flightReturn, [field]: value }
    }));
  };

  const handleAddChecklist = () => {
    if (!newChecklistItem.trim()) return;
    const newItem = {
      id: `c-${Date.now()}`,
      text: newChecklistItem.trim(),
      completed: false
    };
    setFormData(prev => ({ ...prev, checklist: [...prev.checklist, newItem] }));
    setNewChecklistItem('');
  };

  const handleDeleteChecklist = (id) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{event ? `Edit: ${event.name}` : 'Add New Volleyball Event'}</h2>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Modal Sub-Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'hotel' ? 'active' : ''}`}
            onClick={() => setActiveTab('hotel')}
          >
            <Building2 size={16} /> Stay & Play Hotel
          </button>
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'flight' ? 'active' : ''}`}
            onClick={() => setActiveTab('flight')}
          >
            <Plane size={16} /> Travel & Flights
          </button>
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            <Calendar size={16} /> Event Details
          </button>
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklist')}
          >
            <CheckSquare size={16} /> Checklist
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* TAB 1: STAY AND PLAY HOTEL */}
          {activeTab === 'hotel' && (
            <div className="form-grid">
              <div className="form-group">
                <label>Stay & Play Status</label>
                <select 
                  className="form-input" 
                  value={formData.hotelStatus}
                  onChange={e => handleChange('hotelStatus', e.target.value)}
                >
                  <option value="not_started">⏳ Waiting for Email</option>
                  <option value="email_received">✉️ Email Received</option>
                  <option value="deadline_set">🚨 Deadline Set (Action Required)</option>
                  <option value="booked">✅ Hotel Booked</option>
                  <option value="not_required">Not Required</option>
                </select>
              </div>

              <div className="form-group">
                <label>Booking Cutoff Deadline Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={formData.hotelDeadline}
                  onChange={e => handleChange('hotelDeadline', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Team Passcode / Group Booking Code</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. VOLLEY2027"
                  value={formData.hotelBookingCode}
                  onChange={e => handleChange('hotelBookingCode', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Stay & Play Housing Portal Link</label>
                <input 
                  type="url" 
                  className="form-input"
                  placeholder="https://..."
                  value={formData.hotelBookingUrl}
                  onChange={e => handleChange('hotelBookingUrl', e.target.value)}
                />
              </div>

              <div className="form-group full-width" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)' }}>Booked Hotel Details</h4>
              </div>

              <div className="form-group">
                <label>Hotel Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. Embassy Suites Oceanfront"
                  value={formData.hotelName}
                  onChange={e => handleChange('hotelName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Hotel Confirmation #</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. 8920491"
                  value={formData.hotelConfirmation}
                  onChange={e => handleChange('hotelConfirmation', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Check-in Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={formData.checkInDate}
                  onChange={e => handleChange('checkInDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Check-out Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={formData.checkOutDate}
                  onChange={e => handleChange('checkOutDate', e.target.value)}
                />
              </div>

              {/* Deposit & Financial Tracking */}
              <div className="form-group full-width" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Wallet size={16} /> Hotel Payment & Deposit Tracking
                </h4>
              </div>

              <div className="form-group">
                <label>Total Hotel Cost ($)</label>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder="e.g. 450"
                  value={formData.hotelCost}
                  onChange={e => handleChange('hotelCost', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Deposit Paid ($)</label>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder="e.g. 100 (1 night deposit)"
                  value={formData.hotelDepositPaid}
                  onChange={e => handleChange('hotelDepositPaid', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Remaining Balance Due ($)</label>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder="e.g. 350 (Due at check-in)"
                  value={formData.hotelBalanceDue}
                  onChange={e => handleChange('hotelBalanceDue', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Payment Status</label>
                <select 
                  className="form-input"
                  value={formData.hotelPaymentStatus}
                  onChange={e => handleChange('hotelPaymentStatus', e.target.value)}
                >
                  <option value="unpaid">🔴 Unpaid</option>
                  <option value="deposit_paid">💳 Deposit Paid (Balance Due at Check-in)</option>
                  <option value="fully_paid">✅ Fully Paid</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Hotel & Payment Notes</label>
                <textarea 
                  className="form-input"
                  placeholder="e.g. Paid $100 deposit on 10/12. Remaining $350 balance will be charged at check-in desk."
                  value={formData.hotelNotes}
                  onChange={e => handleChange('hotelNotes', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: TRAVEL & FLIGHTS */}
          {activeTab === 'flight' && (
            <div className="form-grid">
              <div className="form-group">
                <label>Travel Mode</label>
                <select 
                  className="form-input"
                  value={formData.travelMode}
                  onChange={e => handleChange('travelMode', e.target.value)}
                >
                  <option value="driving">🚗 Driving</option>
                  <option value="flying">✈️ Flying</option>
                  <option value="tbd">❓ TBD</option>
                </select>
              </div>

              {formData.travelMode === 'flying' && (
                <div className="form-group">
                  <label>Flight Booking Status</label>
                  <select 
                    className="form-input"
                    value={formData.flightStatus}
                    onChange={e => handleChange('flightStatus', e.target.value)}
                  >
                    <option value="needed">✈️ Flight Needed</option>
                    <option value="booked">✅ Flight Booked</option>
                    <option value="not_needed">Not Needed</option>
                  </select>
                </div>
              )}

              {formData.travelMode === 'flying' && (
                <>
                  <div className="form-group">
                    <label>Airline & Confirmation #</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="e.g. Delta - ABC123XYZ"
                      value={formData.flightConfirmation}
                      onChange={e => handleChange('flightConfirmation', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Total Flight Cost ($)</label>
                    <input 
                      type="number" 
                      className="form-input"
                      placeholder="e.g. 350"
                      value={formData.flightCost}
                      onChange={e => handleChange('flightCost', e.target.value)}
                    />
                  </div>

                  <div className="form-group full-width" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>Outbound Flight</h4>
                  </div>

                  <div className="form-group">
                    <label>Airline & Flight #</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="e.g. DL 1420"
                      value={formData.flightOutbound.flightNum}
                      onChange={e => handleFlightOutboundChange('flightNum', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Destination Airport Code</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="e.g. MCO, ATL, IND"
                      value={formData.flightOutbound.to}
                      onChange={e => handleFlightOutboundChange('to', e.target.value)}
                    />
                  </div>

                  <div className="form-group full-width" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>Return Flight</h4>
                  </div>

                  <div className="form-group">
                    <label>Airline & Flight #</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="e.g. DL 1840"
                      value={formData.flightReturn.flightNum}
                      onChange={e => handleFlightReturnChange('flightNum', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="form-group full-width">
                <label>Travel & Driving / Carpool Notes</label>
                <textarea 
                  className="form-input"
                  placeholder="e.g. Driving 4.5 hours. Carpooling with Miller family."
                  value={formData.travelNotes}
                  onChange={e => handleChange('travelNotes', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 3: BASIC EVENT INFO */}
          {activeTab === 'basic' && (
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Tournament Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={formData.startDate}
                  onChange={e => handleChange('startDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={formData.endDate}
                  onChange={e => handleChange('endDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Display Dates Text</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Jan 16–18, 2027"
                  value={formData.displayDates}
                  onChange={e => handleChange('displayDates', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>City & State</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Myrtle Beach, SC"
                  value={formData.location}
                  onChange={e => handleChange('location', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Venue / Convention Center</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Orange County Convention Center"
                  value={formData.venue}
                  onChange={e => handleChange('venue', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Event Category</label>
                <select 
                  className="form-input"
                  value={formData.category}
                  onChange={e => handleChange('category', e.target.value)}
                >
                  <option value="Regular Tournament">Regular Tournament</option>
                  <option value="Qualifier">National Qualifier</option>
                  <option value="National Championship">National Championship</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={formData.requiresQualification}
                    onChange={e => handleChange('requiresQualification', e.target.checked)}
                  />
                  <span>Requires Bid / Qualification (e.g. USAV Nationals)</span>
                </label>
              </div>

              <div className="form-group full-width">
                <label>General Tournament Notes</label>
                <textarea 
                  className="form-input"
                  value={formData.notes}
                  onChange={e => handleChange('notes', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 4: CHECKLIST */}
          {activeTab === 'checklist' && (
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input 
                  type="text" 
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder="Add custom task (e.g. Pack jersey #12, Pay team fee)"
                  value={newChecklistItem}
                  onChange={e => setNewChecklistItem(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddChecklist())}
                />
                <button type="button" className="btn btn-primary" onClick={handleAddChecklist}>
                  <Plus size={16} /> Add
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {formData.checklist.map(item => (
                  <div 
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'var(--bg-input)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <span>{item.text}</span>
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleDeleteChecklist(item.id)}
                    >
                      <Trash2 size={14} color="var(--accent-rose)" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            {event && onDelete ? (
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ color: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}
                onClick={() => onDelete(event.id)}
              >
                <Trash2 size={16} /> Delete Event
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
