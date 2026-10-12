import React from 'react';
import { 
  Trophy, 
  Plus, 
  Calendar, 
  Printer, 
  Download, 
  Upload, 
  Zap, 
  Sun, 
  Moon,
  Database
} from 'lucide-react';
import { downloadICS } from '../utils/ics';

export function Navbar({ 
  events, 
  onAddEvent, 
  onOpenParser, 
  onOpenSheetyModal,
  sheetyUrl,
  theme, 
  setTheme, 
  onExportData, 
  onImportData 
}) {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCalendar = () => {
    downloadICS(events, "volleyball_season_2027.ics");
  };

  return (
    <header className="header-bar">
      <div className="brand-title">
        <div className="brand-icon">
          <Trophy size={24} />
        </div>
        <div>
          <h1>Volleyball Travel & Stay-and-Play Tracker</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Season 2027 • Hotel Blocks, Flights & Google Sheets Sync
          </p>
        </div>
      </div>

      <div className="header-actions">
        <button 
          className="btn btn-primary" 
          onClick={onOpenParser}
          title="Paste club emails to automatically extract hotel & deadline details"
        >
          <Zap size={16} />
          Email Quick-Parser
        </button>

        <button 
          className="btn btn-secondary" 
          onClick={onOpenSheetyModal}
          style={{ borderColor: sheetyUrl ? 'var(--status-booked-border)' : 'var(--border-color)' }}
        >
          <Database size={16} color={sheetyUrl ? 'var(--status-booked-text)' : 'currentColor'} />
          Google Sheet Sync {sheetyUrl && <span style={{ width: '8px', height: '8px', background: 'var(--status-booked-text)', borderRadius: '50%' }} />}
        </button>

        <button className="btn btn-secondary" onClick={onAddEvent}>
          <Plus size={16} />
          Add Event
        </button>

        <button className="btn btn-outline" onClick={handleExportCalendar} title="Download .ics for Apple/Google Calendar">
          <Calendar size={16} />
          Export Calendar (.ics)
        </button>

        <button className="btn btn-outline no-print" onClick={handlePrint} title="Print Travel Summary">
          <Printer size={16} />
          Print
        </button>

        <button 
          className="btn btn-outline"
          onClick={onExportData}
          title="Backup season data to JSON file"
        >
          <Download size={16} />
          Backup JSON
        </button>

        <label className="btn btn-outline" style={{ cursor: 'pointer' }} title="Import season data from JSON">
          <Upload size={16} />
          Import
          <input 
            type="file" 
            accept=".json" 
            onChange={onImportData} 
            style={{ display: 'none' }} 
          />
        </label>

        <button 
          className="btn btn-outline" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
