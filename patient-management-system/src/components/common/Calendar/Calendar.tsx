import React from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { Appointment } from '../../Appointments/types/appointment';

interface CalendarProps {
  events: Appointment[];
  onSelectSlot: (arg: DateSelectArg) => void;
  onEventClick: (arg: EventClickArg) => void;
  showBackButton?: boolean;
  initialView?: 'timeGridWeek' | 'timeGridDay' | 'dayGridMonth';
  validRange?: {
    start?: string;
    end?: string;
  };
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onSelectSlot,
  onEventClick,
  showBackButton = true,
  initialView = 'timeGridWeek',
}) => {
  const navigate = useNavigate();

  return (
    <div>
      {showBackButton && (
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: '10px',
            padding: '8px 12px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
      )}

      <FullCalendar
        events={events}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={initialView}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        selectable
        editable={false}
        selectAllow={(selectInfo) => {
          const now = new Date();
          return selectInfo.start >= now;
        }}
        select={(arg) => {
          // Only allow slot selection in day and week views
          if (arg.view.type === 'timeGridDay' || arg.view.type === 'timeGridWeek') {
            onSelectSlot(arg);
          }
        }}
        eventClick={onEventClick}
        height="auto"
      />
    </div>
  );
};

export default Calendar;