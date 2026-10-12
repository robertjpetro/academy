import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { UrgentAlerts } from './components/UrgentAlerts';
import { EventCard } from './components/EventCard';
import { EventModal } from './components/EventModal';
import { EmailParserModal } from './components/EmailParserModal';
import { SheetySyncModal } from './components/SheetySyncModal';
import { CalendarView } from './components/CalendarView';
import { DeadlinesView } from './components/DeadlinesView';
import { TravelItineraryView } from './components/TravelItineraryView';

import { INITIAL_EVENTS } from './data/initialEvents';
import { 
  DEFAULT_SHEETY_URL, 
  fetchEventsFromSheety, 
  updateSheetyEvent, 
  createSheetyEvent, 
  deleteSheetyEvent 
} from './services/sheetyService';

import { 
  Search, 
  Filter, 
  List, 
  Calendar as CalendarIcon, 
  Clock, 
  FileText, 
  RotateCcw,
  Sparkles,
  RefreshCw,
  Database,
  UploadCloud
} from 'lucide-react';

const SHEETY_KEY = 'vb_sheety_url';
const THEME_KEY = 'vb_app_theme';

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [sheetyUrl, setSheetyUrl] = useState(() => {
    return localStorage.getItem(SHEETY_KEY) || DEFAULT_SHEETY_URL;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark';
  });

  const [currentView, setCurrentView] = useState('list'); // 'list' | 'calendar' | 'deadlines' | 'itinerary'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [editingEvent, setEditingEvent] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isParserOpen, setIsParserOpen] = useState(false);
  const [isSheetyModalOpen, setIsSheetyModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Sync Sheety URL to local storage
  useEffect(() => {
    if (sheetyUrl) {
      localStorage.setItem(SHEETY_KEY, sheetyUrl);
    }
  }, [sheetyUrl]);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Load events DIRECTLY from Google Sheets on mount
  const loadEventsFromSheet = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const fetched = await fetchEventsFromSheety(sheetyUrl);
      setEvents(fetched);
    } catch (err) {
      console.error('Error fetching events from Google Sheet:', err);
      setErrorMsg(err.message);
      // Fallback to initial events if sheet is totally empty/uninitialized
      setEvents(INITIAL_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventsFromSheet();
  }, [sheetyUrl]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUpdateStatus = async (eventId, field, newStatus) => {
    const target = events.find(e => e.id === eventId);
    if (!target) return;

    const updated = { ...target, [field]: newStatus };

    // Optimistic UI update
    setEvents(prev => prev.map(evt => evt.id === eventId ? updated : evt));

    try {
      if (target.sheetyRowId) {
        await updateSheetyEvent(sheetyUrl, target.sheetyRowId, updated);
      } else {
        const created = await createSheetyEvent(sheetyUrl, updated);
        if (created && created.sheetyRowId) {
          setEvents(prev => prev.map(evt => evt.id === eventId ? created : evt));
        }
      }
      showToast('Saved status change to Google Sheet!');
    } catch (err) {
      showToast(`Error saving to Google Sheet: ${err.message}`);
    }
  };

  const handleToggleChecklist = async (eventId, itemId) => {
    const target = events.find(e => e.id === eventId);
    if (!target) return;

    const updatedChecklist = (target.checklist || []).map(chk => {
      if (chk.id === itemId) return { ...chk, completed: !chk.completed };
      return chk;
    });

    const updated = { ...target, checklist: updatedChecklist };

    // Optimistic UI update
    setEvents(prev => prev.map(evt => evt.id === eventId ? updated : evt));

    try {
      if (target.sheetyRowId) {
        await updateSheetyEvent(sheetyUrl, target.sheetyRowId, updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEvent = async (savedData) => {
    setEditingEvent(null);
    setIsAddingEvent(false);
    showToast(`Saving ${savedData.name} to Google Sheet...`);

    try {
      let result;
      if (savedData.sheetyRowId) {
        result = await updateSheetyEvent(sheetyUrl, savedData.sheetyRowId, savedData);
      } else {
        result = await createSheetyEvent(sheetyUrl, savedData);
      }

      if (result) {
        setEvents(prev => {
          const exists = prev.some(e => e.id === savedData.id || (e.sheetyRowId && e.sheetyRowId === result.sheetyRowId));
          if (exists) {
            return prev.map(e => (e.id === savedData.id || e.sheetyRowId === result.sheetyRowId) ? result : e);
          }
          return [...prev, result];
        });
      }
      showToast(`Successfully saved ${savedData.name} to Google Sheet!`);
    } catch (err) {
      alert(`Failed to save to Google Sheet: ${err.message}`);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const target = events.find(e => e.id === eventId);
    if (!target) return;

    if (window.confirm(`Are you sure you want to delete ${target.name} from your Google Sheet?`)) {
      setEvents(prev => prev.filter(e => e.id !== eventId));
      setEditingEvent(null);

      if (target.sheetyRowId) {
        try {
          await deleteSheetyEvent(sheetyUrl, target.sheetyRowId);
          showToast('Deleted event from Google Sheet.');
        } catch (err) {
          alert(`Error deleting from Google Sheet: ${err.message}`);
        }
      }
    }
  };

  const handleApplyParsedData = async (eventId, parsedData) => {
    const target = events.find(e => e.id === eventId);
    if (!target) return;

    const updated = { ...target };
    if (parsedData.confirmation) updated.hotelConfirmation = parsedData.confirmation;
    if (parsedData.hotelName) updated.hotelName = parsedData.hotelName;
    if (parsedData.deadline) {
      updated.hotelDeadline = parsedData.deadline;
      updated.hotelStatus = 'deadline_set';
    }
    if (parsedData.bookingUrl) updated.hotelBookingUrl = parsedData.bookingUrl;
    if (parsedData.cost) updated.hotelCost = parsedData.cost;

    setEvents(prev => prev.map(e => e.id === eventId ? updated : e));

    if (target.sheetyRowId) {
      try {
        await updateSheetyEvent(sheetyUrl, target.sheetyRowId, updated);
        showToast('Applied and saved email details to Google Sheet!');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSeedSheet = async () => {
    if (!window.confirm('Seed your Google Sheet with all 11 default season tournaments?')) return;
    setLoading(true);
    let count = 0;
    try {
      for (const evt of INITIAL_EVENTS) {
        await createSheetyEvent(sheetyUrl, evt);
        count++;
      }
      showToast(`Seeded ${count} tournaments to Google Sheet!`);
      await loadEventsFromSheet();
    } catch (err) {
      alert(`Error seeding Google Sheet: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `volleyball_season_sheet_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup JSON downloaded!');
  };

  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            setLoading(true);
            for (const evt of parsed) {
              await createSheetyEvent(sheetyUrl, evt);
            }
            showToast('Imported schedule to Google Sheet!');
            await loadEventsFromSheet();
          }
        } catch (err) {
          alert('Invalid JSON file format.');
        } finally {
          setLoading(false);
        }
      };
    }
  };

  // Filtered Events
  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          evt.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (evt.hotelName && evt.hotelName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || evt.category === categoryFilter;

    let matchesStatus = true;
    if (statusFilter === 'booked') {
      matchesStatus = evt.hotelStatus === 'booked';
    } else if (statusFilter === 'pending') {
      matchesStatus = evt.hotelStatus !== 'booked' && evt.hotelStatus !== 'not_required';
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--primary)',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 200,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <Sparkles size={16} /> {notification}
        </div>
      )}

      {/* Navbar */}
      <Navbar 
        events={events}
        onAddEvent={() => setIsAddingEvent(true)}
        onOpenParser={() => setIsParserOpen(true)}
        onOpenSheetyModal={() => setIsSheetyModalOpen(true)}
        sheetyUrl={sheetyUrl}
        theme={theme}
        setTheme={setTheme}
        onExportData={handleExportJSON}
        onImportData={handleImportJSON}
      />

      {/* Google Sheet Status Banner */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.75rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Database size={18} color="var(--accent-emerald)" />
          <span>
            Connected to Google Sheet: <code style={{ color: 'var(--accent-cyan)' }}>academy / events</code>
          </span>
          {loading && <RefreshCw size={14} className="spin" color="var(--accent-gold)" />}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-sm btn-outline" onClick={loadEventsFromSheet} disabled={loading}>
            <RefreshCw size={14} /> Refresh Sheet Data
          </button>
          <button className="btn btn-sm btn-secondary" onClick={handleSeedSheet} disabled={loading}>
            <UploadCloud size={14} /> Push 11 Tournaments to Sheet
          </button>
        </div>
      </div>

      {/* Stats Metric Cards */}
      <StatsBanner events={events} />

      {/* Urgent Cutoff Banner */}
      <UrgentAlerts events={events} onEditEvent={(evt) => setEditingEvent(evt)} />

      {/* View Switcher & Search Bar */}
      <div className="view-tabs-bar">
        <div className="view-tabs">
          <button 
            className={`tab-btn ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => setCurrentView('list')}
          >
            <List size={16} /> List / Cards ({filteredEvents.length})
          </button>
          <button 
            className={`tab-btn ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => setCurrentView('calendar')}
          >
            <CalendarIcon size={16} /> Calendar
          </button>
          <button 
            className={`tab-btn ${currentView === 'deadlines' ? 'active' : ''}`}
            onClick={() => setCurrentView('deadlines')}
          >
            <Clock size={16} /> Stay & Play Deadlines
          </button>
          <button 
            className={`tab-btn ${currentView === 'itinerary' ? 'active' : ''}`}
            onClick={() => setCurrentView('itinerary')}
          >
            <FileText size={16} /> Master Itinerary & Budget
          </button>
        </div>

        <div className="filter-controls">
          <div className="search-input-wrap">
            <Search size={16} />
            <input 
              type="text" 
              className="search-input"
              placeholder="Search tournaments or hotels..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="select-input"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Regular Tournament">Regular Tournaments</option>
            <option value="Qualifier">National Qualifiers</option>
            <option value="National Championship">National Championships</option>
          </select>

          <select 
            className="select-input"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Hotel Statuses</option>
            <option value="pending">⏳ Pending Hotel</option>
            <option value="booked">✅ Hotel Booked</option>
          </select>

          <button 
            className="btn btn-outline btn-sm"
            onClick={loadEventsFromSheet}
            title="Reload from Google Sheet"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* MAIN VIEW CONTENT */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="spin" style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
          <h3>Loading events from Google Sheet...</h3>
        </div>
      ) : currentView === 'list' ? (
        <div className="events-grid">
          {filteredEvents.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No tournaments found in your Google Sheet. Click "Push 11 Tournaments to Sheet" to populate!
            </div>
          ) : (
            filteredEvents.map(evt => (
              <EventCard 
                key={evt.id}
                event={evt}
                onEdit={(e) => setEditingEvent(e)}
                onUpdateStatus={handleUpdateStatus}
                onToggleChecklist={handleToggleChecklist}
              />
            ))
          )}
        </div>
      ) : currentView === 'calendar' ? (
        <CalendarView 
          events={events} 
          onEditEvent={(e) => setEditingEvent(e)} 
        />
      ) : currentView === 'deadlines' ? (
        <DeadlinesView 
          events={events} 
          onEditEvent={(e) => setEditingEvent(e)}
          onUpdateStatus={handleUpdateStatus}
        />
      ) : (
        <TravelItineraryView 
          events={events} 
          onEditEvent={(e) => setEditingEvent(e)}
        />
      )}

      {/* EDIT / ADD MODAL */}
      {(editingEvent || isAddingEvent) && (
        <EventModal 
          event={editingEvent}
          onClose={() => { setEditingEvent(null); setIsAddingEvent(false); }}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}

      {/* EMAIL PARSER MODAL */}
      {isParserOpen && (
        <EmailParserModal 
          events={events}
          onClose={() => setIsParserOpen(false)}
          onApplyParsedData={handleApplyParsedData}
        />
      )}

      {/* SHEETY SYNC MODAL */}
      {isSheetyModalOpen && (
        <SheetySyncModal 
          sheetyUrl={sheetyUrl}
          setSheetyUrl={setSheetyUrl}
          events={events}
          onSyncFromSheety={(remoteEvents) => setEvents(remoteEvents)}
          onClose={() => setIsSheetyModalOpen(false)}
          onShowToast={showToast}
        />
      )}
    </div>
  );
}
