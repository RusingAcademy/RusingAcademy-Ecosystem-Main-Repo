/**
 * HRCalendar — Training Calendar for Client Portal
 * Shows upcoming sessions, cohort milestones, and exam dates.
 */
import HRLayout from "@/components/HRLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export default function HRCalendar() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month");

  const ui = {
    title: isEn ? "Training Calendar" : "Calendrier de formation",
    subtitle: isEn ? "View upcoming sessions, milestones, and exam dates" : "Consultez les sessions à venir, les jalons et les dates d'examen",
    month: isEn ? "Month" : "Mois",
    week: isEn ? "Week" : "Semaine",
    list: isEn ? "List" : "Liste",
    today: isEn ? "Today" : "Aujourd'hui",
    noEvents: isEn ? "No upcoming events" : "Aucun événement à venir",
    noEventsSub: isEn ? "Training sessions and exam dates will appear here once scheduled." : "Les sessions de formation et les dates d'examen apparaîtront ici une fois planifiées.",
    upcomingSessions: isEn ? "Upcoming Sessions" : "Sessions à venir",
    examDates: isEn ? "Exam Dates" : "Dates d'examen",
    cohortMilestones: isEn ? "Cohort Milestones" : "Jalons des cohortes",
  };

  const months = isEn
    ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    : ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const days = isEn
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  return (
    <HRLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ui.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{ui.subtitle}</p>
          </div>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {(["month", "week", "list"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  viewMode === mode ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {ui[mode]}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="material-icons text-gray-600">chevron_left</span>
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {months[currentMonth]} {currentYear}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="material-icons text-gray-600">chevron_right</span>
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {days.map((day) => (
              <div key={day} className="p-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                {day}
              </div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="p-3 min-h-[80px] border-b border-r border-gray-50" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();
              return (
                <div
                  key={day}
                  className={`p-2 min-h-[80px] border-b border-r border-gray-50 hover:bg-blue-600/5 transition-colors cursor-pointer ${
                    isToday ? "bg-blue-600/5" : ""
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm ${
                    isToday ? "bg-blue-600 text-white font-bold" : "text-gray-700"
                  }`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            {ui.upcomingSessions}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600" />
            {ui.examDates}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--semantic-success, #16a34a)]" />
            {ui.cohortMilestones}
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-3xl text-blue-600">event_note</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{ui.noEvents}</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">{ui.noEventsSub}</p>
        </div>
      </div>
    </HRLayout>
  );
}
