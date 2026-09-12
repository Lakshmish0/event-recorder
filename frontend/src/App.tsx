import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EventProvider, useEvents } from './context/EventContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { BottomTabBar } from './components/layout/BottomTabBar';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { CalendarPage } from './pages/CalendarPage';
import { GalleryPage } from './pages/GalleryPage';
import { SettingsPage } from './pages/SettingsPage';
import { AddEventModal } from './components/modals/AddEventModal';
import { EditEventModal } from './components/modals/EditEventModal';
import { DeleteEventModal } from './components/modals/DeleteEventModal';

function AppContent() {
  const {
    isAddModalOpen,
    closeAddModal,
    createEvent,
    editingEvent,
    closeEditModal,
    updateEvent,
    deletingEvent,
    closeDeleteModal,
    deleteEvent,
  } = useEvents();

  return (
    <div className="flex min-h-screen bg-[#fcf8f2] text-[#2d1f19]">
      {/* Desktop / Tablet Navigation Sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Navigation Bar */}
        <TopHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Navigation Tab Bar */}
      <BottomTabBar />

      {/* Global Event Modals */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={async (data) => {
          await createEvent(data);
        }}
      />

      <EditEventModal
        isOpen={!!editingEvent}
        event={editingEvent}
        onClose={closeEditModal}
        onSave={async (id, data) => {
          await updateEvent(id, data);
        }}
      />

      <DeleteEventModal
        isOpen={!!deletingEvent}
        event={deletingEvent}
        onClose={closeDeleteModal}
        onConfirm={async (id) => {
          await deleteEvent(id);
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <EventProvider>
        <AppContent />
      </EventProvider>
    </Router>
  );
}

export default App;
