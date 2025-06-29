import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  X, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  Pill,
  Check,
  AlertCircle,
  Smartphone,
  Mail
} from 'lucide-react';

interface MedicationInfo {
  name: string;
  dosage: string;
  schedule: string;
  instructions: string;
  warnings?: string[];
  plainLanguage: string;
}

interface ReminderTime {
  id: string;
  time: string;
  medication: string;
  dosage: string;
  notes?: string;
}

interface DaySchedule {
  date: string;
  reminders: ReminderTime[];
}

interface SmartReminderSchedulerProps {
  medications: MedicationInfo[];
  personalName?: string;
  onClose: () => void;
}

const SmartReminderScheduler: React.FC<SmartReminderSchedulerProps> = ({ 
  medications, 
  personalName = 'You',
  onClose 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState<{ [key: string]: DaySchedule }>({});
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    time: '08:00',
    medication: medications[0]?.name || '',
    dosage: medications[0]?.dosage || '',
    notes: ''
  });
  const [reminderMethod, setReminderMethod] = useState<'phone' | 'email'>('phone');

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const addReminder = () => {
    const dateKey = formatDate(selectedDate);
    const reminder: ReminderTime = {
      id: Date.now().toString(),
      time: newReminder.time,
      medication: newReminder.medication,
      dosage: newReminder.dosage,
      notes: newReminder.notes
    };

    setSchedule(prev => ({
      ...prev,
      [dateKey]: {
        date: dateKey,
        reminders: [...(prev[dateKey]?.reminders || []), reminder].sort((a, b) => a.time.localeCompare(b.time))
      }
    }));

    setShowAddReminder(false);
    setNewReminder({
      time: '08:00',
      medication: medications[0]?.name || '',
      dosage: medications[0]?.dosage || '',
      notes: ''
    });
  };

  const removeReminder = (dateKey: string, reminderId: string) => {
    setSchedule(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        reminders: prev[dateKey].reminders.filter(r => r.id !== reminderId)
      }
    }));
  };

  const getRemindersForDate = (date: Date) => {
    const dateKey = formatDate(date);
    return schedule[dateKey]?.reminders || [];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const generateTimelinePreview = () => {
    const next7Days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const reminders = getRemindersForDate(date);
      if (reminders.length > 0) {
        next7Days.push({ date, reminders });
      }
    }
    
    return next7Days;
  };

  const getTotalReminders = () => {
    return Object.values(schedule).reduce((total, day) => total + day.reminders.length, 0);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-[1200px] h-[800px] flex flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-strong dark:shadow-dark-strong animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Smart Reminder Scheduler</h2>
                <p className="text-primary-100">Set up medication reminders for {personalName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-300"
              aria-label="Close scheduler"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 grid lg:grid-cols-2 gap-8 min-h-full">
            {/* Calendar Section */}
            <div className="space-y-6 flex flex-col">
              {/* Calendar Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft dark:shadow-dark-soft border border-gray-100 dark:border-gray-700 flex-shrink-0">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((date, index) => {
                    if (!date) {
                      return <div key={index} className="h-12"></div>;
                    }

                    const reminders = getRemindersForDate(date);
                    const hasReminders = reminders.length > 0;

                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`h-12 rounded-xl text-sm font-medium transition-all duration-300 relative ${
                          isSelected(date)
                            ? 'bg-primary-500 text-white shadow-medium'
                            : isToday(date)
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {date.getDate()}
                        {hasReminders && (
                          <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                            isSelected(date) ? 'bg-white text-primary-500' : 'bg-primary-500 text-white'
                          }`}>
                            {reminders.length}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Date Reminders */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border border-gray-100 dark:border-gray-700 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {formatDateDisplay(selectedDate)}
                  </h4>
                  <button
                    onClick={() => setShowAddReminder(true)}
                    className="flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Reminder
                  </button>
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {getRemindersForDate(selectedDate).map(reminder => (
                    <div key={reminder.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex-shrink-0">
                        <Bell className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-blue-800 dark:text-blue-300">{reminder.time}</span>
                          <span className="text-blue-600 dark:text-blue-400">•</span>
                          <span className="font-medium text-blue-700 dark:text-blue-300 truncate">{reminder.medication}</span>
                        </div>
                        <p className="text-sm text-blue-600 dark:text-blue-400">{reminder.dosage}</p>
                        {reminder.notes && (
                          <p className="text-sm text-blue-500 dark:text-blue-400 mt-1">{reminder.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeReminder(formatDate(selectedDate), reminder.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-300 text-red-500 flex-shrink-0"
                        aria-label="Remove reminder"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {getRemindersForDate(selectedDate).length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p>No reminders set for this day</p>
                      <p className="text-sm">Click "Add Reminder" to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline Preview Section */}
            <div className="space-y-6 flex flex-col">
              {/* Reminder Method Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border border-gray-100 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Reminder Method</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setReminderMethod('phone')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      reminderMethod === 'phone'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">Phone Notifications</p>
                    <p className="text-sm opacity-75">Push notifications</p>
                  </button>
                  <button
                    onClick={() => setReminderMethod('email')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      reminderMethod === 'email'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Mail className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">Email Reminders</p>
                    <p className="text-sm opacity-75">Daily summaries</p>
                  </button>
                </div>
              </div>

              {/* Schedule Summary */}
              <div className="bg-gradient-to-r from-success-50 to-emerald-50 dark:from-success-900/30 dark:to-emerald-900/30 rounded-2xl p-6 border border-success-200 dark:border-success-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-success-500 to-emerald-600 rounded-xl">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-success-800 dark:text-success-300">Schedule Summary</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-60 dark:bg-gray-800 dark:bg-opacity-60 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-success-700 dark:text-success-300">{getTotalReminders()}</p>
                    <p className="text-sm text-success-600 dark:text-success-400">Total Reminders</p>
                  </div>
                  <div className="bg-white bg-opacity-60 dark:bg-gray-800 dark:bg-opacity-60 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-success-700 dark:text-success-300">{medications.length}</p>
                    <p className="text-sm text-success-600 dark:text-success-400">Medications</p>
                  </div>
                </div>
              </div>

              {/* Timeline Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border border-gray-100 dark:border-gray-700 flex-1">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Next 7 Days Timeline</h4>
                <div className="space-y-4 max-h-48 overflow-y-auto">
                  {generateTimelinePreview().map(({ date, reminders }) => (
                    <div key={date.toISOString()} className="border-l-4 border-primary-500 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-gray-800 dark:text-gray-200">
                          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </h5>
                        {isToday(date) && (
                          <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold px-2 py-1 rounded-full">
                            TODAY
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {reminders.map(reminder => (
                          <div key={reminder.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <div className="p-1 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex-shrink-0">
                              <Pill className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium text-gray-800 dark:text-gray-200">{reminder.time}</span>
                                <span className="text-gray-500 dark:text-gray-400">•</span>
                                <span className="text-gray-700 dark:text-gray-300 truncate">{reminder.medication}</span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{reminder.dosage}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {generateTimelinePreview().length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p>No reminders scheduled</p>
                      <p className="text-sm">Add some reminders to see your timeline</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex gap-3 max-w-md mx-auto">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert(`${getTotalReminders()} reminders saved for ${personalName}! (This is a demo)`);
                onClose();
              }}
              disabled={getTotalReminders() === 0}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
            >
              Save Schedule
            </button>
          </div>
        </div>

        {/* Add Reminder Modal */}
        {showAddReminder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl animate-scale-in">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Add New Reminder</h3>
                  <button
                    onClick={() => setShowAddReminder(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                    <input
                      type="time"
                      value={newReminder.time}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Medication</label>
                    <select
                      value={newReminder.medication}
                      onChange={(e) => {
                        const selectedMed = medications.find(med => med.name === e.target.value);
                        setNewReminder(prev => ({ 
                          ...prev, 
                          medication: e.target.value,
                          dosage: selectedMed?.dosage || ''
                        }));
                      }}
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      {medications.map(med => (
                        <option key={med.name} value={med.name}>{med.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dosage</label>
                    <input
                      type="text"
                      value={newReminder.dosage}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, dosage: e.target.value }))}
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="e.g., 500mg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes (Optional)</label>
                    <input
                      type="text"
                      value={newReminder.notes}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="e.g., Take with food"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddReminder(false)}
                    className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addReminder}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-semibold"
                  >
                    Add Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartReminderScheduler;