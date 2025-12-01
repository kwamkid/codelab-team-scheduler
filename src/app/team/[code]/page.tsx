"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from "date-fns";
import { CalendarPlus, Plus } from "lucide-react";
import { getTeamByCode } from "@/actions/team";
import {
  createSchedule,
  createScheduleRange,
  updateSchedule,
  deleteSchedule,
  getSchedulesByMonth,
} from "@/actions/schedule";
import {
  createEvent,
  createEventRange,
  updateEvent,
  deleteEvent,
  getEventsByMonth,
} from "@/actions/event";
import { TeamWithMembers, ScheduleWithMember, Event, CalendarView } from "@/types";
import TeamHeader from "@/components/team/TeamHeader";
import CalendarNav from "@/components/calendar/CalendarNav";
import DayView from "@/components/calendar/DayView";
import WeekView from "@/components/calendar/WeekView";
import MonthView from "@/components/calendar/MonthView";
import ListView from "@/components/calendar/ListView";
import ScheduleForm from "@/components/schedule/ScheduleForm";
import ScheduleDetail from "@/components/schedule/ScheduleDetail";
import EventForm from "@/components/event/EventForm";
import EventDetail from "@/components/event/EventDetail";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function TeamPage() {
  const params = useParams();
  const code = params.code as string;

  const [team, setTeam] = useState<TeamWithMembers | null>(null);
  const [schedules, setSchedules] = useState<ScheduleWithMember[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [loading, setLoading] = useState(true);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleWithMember | null>(null);
  const [viewingSchedule, setViewingSchedule] = useState<ScheduleWithMember | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const loadData = useCallback(async () => {
    const teamData = await getTeamByCode(code);
    if (teamData) {
      setTeam(teamData);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const [schedulesData, eventsData] = await Promise.all([
        getSchedulesByMonth(teamData.id, year, month),
        getEventsByMonth(teamData.id, year, month),
      ]);
      setSchedules(schedulesData);
      setEvents(eventsData);
    }
    setLoading(false);
  }, [code, currentDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePrevious = () => {
    if (view === "month" || view === "list") setCurrentDate(subMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (view === "month" || view === "list") setCurrentDate(addMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setView("day");
  };

  const handleAddScheduleFromCalendar = (date: Date) => {
    setSelectedDate(date);
    setShowScheduleModal(true);
  };

  const handleCreateSchedule = async (data: {
    memberId: string;
    date: string;
    startTime: string;
    endTime: string;
    task?: string;
  }) => {
    await createSchedule(data);
    setShowScheduleModal(false);
    setSelectedDate(undefined);
    loadData();
  };

  const handleCreateScheduleRange = async (data: {
    memberId: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    task?: string;
  }) => {
    await createScheduleRange(data);
    setShowScheduleModal(false);
    setSelectedDate(undefined);
    loadData();
  };

  const handleUpdateSchedule = async (data: {
    memberId: string;
    date: string;
    startTime: string;
    endTime: string;
    task?: string;
  }) => {
    if (!editingSchedule) return;
    await updateSchedule(editingSchedule.id, {
      startTime: data.startTime,
      endTime: data.endTime,
      task: data.task,
    });
    setEditingSchedule(null);
    loadData();
  };

  const handleDeleteSchedule = async (id: string) => {
    await deleteSchedule(id);
    loadData();
  };

  const handleUpdateScheduleNote = async (data: { task?: string }) => {
    if (!viewingSchedule) return;
    await updateSchedule(viewingSchedule.id, { task: data.task });
    setViewingSchedule(null);
    loadData();
  };

  const handleScheduleClick = (schedule: ScheduleWithMember) => {
    setViewingSchedule(schedule);
  };

  const handleCreateEvent = async (data: {
    title: string;
    date: string;
    startTime?: string;
    endTime?: string;
    description?: string;
  }) => {
    if (!team) return;
    await createEvent({ ...data, teamId: team.id });
    setShowEventModal(false);
    setSelectedDate(undefined);
    loadData();
  };

  const handleCreateEventRange = async (data: {
    title: string;
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
    description?: string;
  }) => {
    if (!team) return;
    await createEventRange({ ...data, teamId: team.id });
    setShowEventModal(false);
    setSelectedDate(undefined);
    loadData();
  };

  const handleUpdateEvent = async (data: { title?: string; description?: string }) => {
    if (!viewingEvent) return;
    await updateEvent(viewingEvent.id, { title: data.title, description: data.description });
    setViewingEvent(null);
    loadData();
  };

  const handleEventClick = (event: Event) => {
    setViewingEvent(event);
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">กำลังโหลด...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-black mb-2">ไม่พบทีม</h1>
          <p className="text-gray-500">กรุณาตรวจสอบรหัสทีม</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeamHeader team={team} />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <CalendarNav
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
        />

        {view === "day" && (
          <DayView
            date={currentDate}
            schedules={schedules}
            events={events}
            onEditSchedule={setEditingSchedule}
            onDeleteSchedule={handleDeleteSchedule}
            onEventClick={handleEventClick}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {view === "week" && (
          <WeekView
            currentDate={currentDate}
            schedules={schedules}
            events={events}
            onDayClick={handleDayClick}
            onAddSchedule={handleAddScheduleFromCalendar}
            onScheduleClick={handleScheduleClick}
            onEventClick={handleEventClick}
          />
        )}

        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            schedules={schedules}
            events={events}
            onDayClick={handleDayClick}
            onAddSchedule={handleAddScheduleFromCalendar}
            onScheduleClick={handleScheduleClick}
            onEventClick={handleEventClick}
          />
        )}

        {view === "list" && (
          <ListView
            currentDate={currentDate}
            schedules={schedules}
            events={events}
            onDayClick={handleDayClick}
            onScheduleClick={handleScheduleClick}
            onEventClick={handleEventClick}
          />
        )}

        <div className="flex gap-3 mt-6 justify-center">
          <Button
            onClick={() => {
              setSelectedDate(view === "day" ? currentDate : undefined);
              setShowScheduleModal(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            ลงตารางใหม่
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedDate(view === "day" ? currentDate : undefined);
              setShowEventModal(true);
            }}
          >
            <CalendarPlus className="w-4 h-4 mr-2" />
            เพิ่ม Event
          </Button>
        </div>
      </main>

      <Modal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setSelectedDate(undefined);
        }}
        title="ลงตารางใหม่"
      >
        <ScheduleForm
          members={team.members}
          initialDate={selectedDate}
          onSubmit={handleCreateSchedule}
          onSubmitRange={handleCreateScheduleRange}
          onCancel={() => setShowScheduleModal(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingSchedule}
        onClose={() => setEditingSchedule(null)}
        title="แก้ไขตาราง"
      >
        {editingSchedule && (
          <ScheduleForm
            members={team.members}
            schedule={editingSchedule}
            onSubmit={handleUpdateSchedule}
            onCancel={() => setEditingSchedule(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!viewingSchedule}
        onClose={() => setViewingSchedule(null)}
        title="รายละเอียดตาราง"
      >
        {viewingSchedule && (
          <ScheduleDetail
            schedule={viewingSchedule}
            onUpdate={handleUpdateScheduleNote}
            onDelete={() => handleDeleteSchedule(viewingSchedule.id)}
            onClose={() => setViewingSchedule(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedDate(undefined);
        }}
        title="เพิ่ม Event"
      >
        <EventForm
          initialDate={selectedDate}
          onSubmit={handleCreateEvent}
          onSubmitRange={handleCreateEventRange}
          onCancel={() => setShowEventModal(false)}
        />
      </Modal>

      <Modal
        isOpen={!!viewingEvent}
        onClose={() => setViewingEvent(null)}
        title={viewingEvent?.title || "รายละเอียด Event"}
      >
        {viewingEvent && (
          <EventDetail
            event={viewingEvent}
            onUpdate={handleUpdateEvent}
            onDelete={() => handleDeleteEvent(viewingEvent.id)}
            onClose={() => setViewingEvent(null)}
          />
        )}
      </Modal>
    </div>
  );
}
