import React, { useState } from 'react';
import { X, RefreshCw, UploadCloud, CheckCircle2, AlertTriangle, ExternalLink, Database } from 'lucide-react';
import { DEFAULT_SHEETY_URL, fetchEventsFromSheety, createSheetyEvent } from '../services/sheetyService';

export function SheetySyncModal({ 
  sheetyUrl, 
  setSheetyUrl, 
  events, 
  onSyncFromSheety, 
  onClose,
  onShowToast 
}) {
  const [urlInput, setUrlInput] = useState(sheetyUrl || DEFAULT_SHEETY_URL);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleTestConnection = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const fetched = await fetchEventsFromSheety(urlInput);
      setSheetyUrl(urlInput);
      setStatusMessage({ type: 'success', text: `Connected! Found ${fetched.length} events in Google Sheets.` });
    } catch (err) {
      setStatusMessage({ 
        type: 'error', 
        text: `Sheety Error: ${err.message}. Make sure Row 1 of your 'events' Google Sheet tab contains column headers (e.g. name, location, hotelStatus).` 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = async () => {
    setLoading(true);
    try {
      const fetched = await fetchEventsFromSheety(urlInput);
      if (fetched && fetched.length > 0) {
        onSyncFromSheety(fetched);
        onShowToast(`Loaded ${fetched.length} events from Google Sheets!`);
        onClose();
      } else {
        setStatusMessage({ type: 'warning', text: 'Google Sheet connected but has 0 rows currently.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedGoogleSheet = async () => {
    if (!window.confirm('This will upload your current 11 tournaments into your Google Sheet via Sheety. Continue?')) {
      return;
    }
    setLoading(true);
    setStatusMessage(null);
    let count = 0;
    try {
      for (const evt of events) {
        await createSheetyEvent(urlInput, evt);
        count++;
      }
      onShowToast(`Successfully seeded ${count} tournaments to Google Sheets!`);
      setStatusMessage({ type: 'success', text: `Seeded ${count} events to Google Sheet.` });
    } catch (err) {
      setStatusMessage({ 
        type: 'error', 
        text: `Error seeding sheet: ${err.message}. (Ensure PUT/POST permissions are enabled in Sheety API settings).` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={22} color="var(--accent-emerald)" />
            <h2>Google Sheets (Sheety.co) Integration</h2>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Connect your Google Sheet via Sheety to automatically sync hotel bookings, deadlines, and travel status across all your devices and family members.
        </p>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Sheety API Endpoint URL</label>
          <input 
            type="url" 
            className="form-input"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://api.sheety.co/..."
          />
        </div>

        {statusMessage && (
          <div style={{
            background: statusMessage.type === 'success' ? 'var(--status-booked-bg)' : 'var(--status-urgent-bg)',
            border: `1px solid ${statusMessage.type === 'success' ? 'var(--status-booked-border)' : 'var(--status-urgent-border)'}`,
            color: statusMessage.type === 'success' ? 'var(--status-booked-text)' : 'var(--status-urgent-text)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.85rem'
          }}>
            {statusMessage.text}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          <button 
            className="btn btn-primary"
            onClick={handleTestConnection}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            {loading ? 'Connecting to Sheety...' : 'Test & Sync Connection'}
          </button>

          <button 
            className="btn btn-secondary"
            onClick={handleFetchData}
            disabled={loading}
          >
            <Database size={16} />
            Pull Data from Google Sheet
          </button>

          <button 
            className="btn btn-outline"
            onClick={handleSeedGoogleSheet}
            disabled={loading}
          >
            <UploadCloud size={16} />
            Push / Seed 11 Tournaments to Google Sheet
          </button>
        </div>

        <div style={{ 
          fontSize: '0.8rem', 
          background: 'var(--bg-input)', 
          padding: '0.75rem', 
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-muted)'
        }}>
          <strong>💡 Important Sheety Setup Note:</strong>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
            <li>Make sure row 1 of your <code>events</code> sheet tab has column headers (e.g. <code>name</code>, <code>location</code>, <code>hotelStatus</code>, <code>hotelDeadline</code>).</li>
            <li>In Sheety project settings, make sure <strong>GET</strong>, <strong>POST</strong>, and <strong>PUT</strong> are enabled.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
