import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  User,
  Video,
  Phone,
} from 'lucide-react-native';
import { useProvider } from '@/providers/ProviderContext';
import { AppointmentStatusService } from '@/services/appointmentStatusService';
import type { Appointment } from '../index';

const { width } = Dimensions.get('window');

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function AppointmentCalendarView() {
  const { assignedCases } = useProvider();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate appointments from assigned cases (same logic as AppointmentsList)
  const appointments: Appointment[] = useMemo(() => {
    const appointmentsList: Appointment[] = [];

    assignedCases.forEach((case_, index) => {
      const numAppointments = 1 + (index % 3);

      for (let i = 0; i < numAppointments; i++) {
        const appointmentDate = new Date();
        appointmentDate.setDate(appointmentDate.getDate() + (index * 2) + i - 5);

        const types = ['consultation', 'follow_up', 'emergency', 'therapy'] as const;
        const modes = ['in_person', 'video_call', 'phone_call'] as const;
        const statuses = ['pending', 'scheduled', 'confirmed', 'declined', 'reschedule_requested', 'rescheduled', 'in_progress', 'completed', 'cancelled'] as const;

        const appointmentId = `${case_.id}-apt-${i}`;
        const liveStatus = AppointmentStatusService.getAppointmentStatus(appointmentId);

        appointmentsList.push({
          id: appointmentId,
          patientName: `Patient ${case_.caseNumber.split('-')[2] || index + 1}`,
          patientId: case_.id,
          type: types[i % types.length],
          mode: modes[i % modes.length],
          date: appointmentDate.toISOString().split('T')[0],
          time: `${9 + (i * 2)}:${i % 2 === 0 ? '00' : '30'}`,
          duration: 30 + (i * 15),
          status: liveStatus !== 'pending' ? liveStatus : statuses[i % statuses.length],
          location: case_.location?.address || case_.location?.description || 'Location not specified',
          notes: i === 0 ? 'Initial consultation' : `Follow-up session ${i}`,
          priority: (['low', 'medium', 'high', 'urgent'] as const)[i % 4],
          caseId: case_.id,
        });
      }
    });

    return appointmentsList.sort((a, b) =>
      new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime()
    );
  }, [assignedCases]);

  // Get calendar data for current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      const dateStr = current.toISOString().split('T')[0];
      const dayAppointments = appointments.filter(apt => apt.date === dateStr);

      days.push({
        date: new Date(current),
        dateString: dateStr,
        isCurrentMonth: current.getMonth() === month,
        isToday: dateStr === new Date().toISOString().split('T')[0],
        appointments: dayAppointments,
        appointmentCount: dayAppointments.length,
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentDate, appointments]);

  // Get appointments for selected date
  const selectedDateAppointments = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  }, [selectedDate, appointments]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#10B981';
      case 'declined': return '#EF4444';
      case 'reschedule_requested': return '#F59E0B';
      case 'rescheduled': return '#3B82F6';
      case 'completed': return '#059669';
      case 'cancelled': return '#6B7280';
      default: return '#9CA3AF';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'video_call': return <Video size={12} color="#6B7280" />;
      case 'phone_call': return <Phone size={12} color="#6B7280" />;
      default: return <MapPin size={12} color="#6B7280" />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Calendar Header */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('prev')}
        >
          <ChevronLeft size={20} color="#6A2CB0" />
        </TouchableOpacity>

        <Text style={styles.monthTitle}>
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('next')}
        >
          <ChevronRight size={20} color="#6A2CB0" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar Grid */}
        <View style={styles.calendar}>
          {/* Day Headers */}
          <View style={styles.dayHeaders}>
            {DAYS.map(day => (
              <Text key={day} style={styles.dayHeader}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.calendarGrid}>
            {calendarData.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  !day.isCurrentMonth && styles.otherMonth,
                  day.isToday && styles.today,
                  selectedDate?.toDateString() === day.date.toDateString() && styles.selectedDay,
                ]}
                onPress={() => setSelectedDate(day.date)}
              >
                <Text style={[
                  styles.dayNumber,
                  !day.isCurrentMonth && styles.otherMonthText,
                  day.isToday && styles.todayText,
                  selectedDate?.toDateString() === day.date.toDateString() && styles.selectedDayText,
                ]}>
                  {day.date.getDate()}
                </Text>

                {/* Appointment Indicators */}
                {day.appointmentCount > 0 && (
                  <View style={styles.appointmentIndicators}>
                    {day.appointments.slice(0, 3).map((apt, aptIndex) => (
                      <View
                        key={aptIndex}
                        style={[
                          styles.appointmentDot,
                          { backgroundColor: getStatusColor(apt.status) }
                        ]}
                      />
                    ))}
                    {day.appointmentCount > 3 && (
                      <Text style={styles.moreIndicator}>+{day.appointmentCount - 3}</Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Date Appointments */}
        {selectedDate && (
          <View style={styles.selectedDateSection}>
            <Text style={styles.selectedDateTitle}>
              Appointments for {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>

            {selectedDateAppointments.length === 0 ? (
              <View style={styles.noAppointments}>
                <Calendar size={32} color="#D1D5DB" />
                <Text style={styles.noAppointmentsText}>No appointments scheduled</Text>
              </View>
            ) : (
              <View style={styles.appointmentsList}>
                {selectedDateAppointments.map((appointment) => (
                  <View key={appointment.id} style={styles.appointmentCard}>
                    <View style={styles.appointmentHeader}>
                      <View style={styles.appointmentTime}>
                        <Clock size={14} color="#6B7280" />
                        <Text style={styles.timeText}>{appointment.time}</Text>
                        <Text style={styles.durationText}>({appointment.duration}min)</Text>
                      </View>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(appointment.status) }
                      ]}>
                        <Text style={styles.statusText}>
                          {appointment.status.replace('_', ' ')}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.appointmentDetails}>
                      <View style={styles.patientInfo}>
                        <User size={16} color="#374151" />
                        <Text style={styles.patientName}>{appointment.patientName}</Text>
                      </View>

                      <View style={styles.appointmentMeta}>
                        <View style={styles.metaItem}>
                          {getModeIcon(appointment.mode)}
                          <Text style={styles.metaText}>
                            {appointment.mode === 'in_person' ? 'In Person' :
                             appointment.mode === 'video_call' ? 'Video Call' : 'Phone Call'}
                          </Text>
                        </View>

                        <Text style={styles.typeText}>{appointment.type}</Text>
                      </View>

                      {appointment.location && appointment.mode === 'in_person' && (
                        <View style={styles.locationInfo}>
                          <MapPin size={14} color="#6B7280" />
                          <Text style={styles.locationText} numberOfLines={1}>
                            {appointment.location}
                          </Text>
                        </View>
                      )}

                      {appointment.notes && (
                        <Text style={styles.notesText} numberOfLines={2}>
                          {appointment.notes}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  content: {
    flex: 1,
  },
  calendar: {
    padding: 16,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: (width - 32) / 7,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 4,
    position: 'relative',
  },
  otherMonth: {
    opacity: 0.3,
  },
  today: {
    backgroundColor: '#E0E7FF',
  },
  selectedDay: {
    backgroundColor: '#6A2CB0',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  otherMonthText: {
    color: '#9CA3AF',
  },
  todayText: {
    color: '#3730A3',
    fontWeight: '600',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  appointmentIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 2,
  },
  appointmentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  moreIndicator: {
    fontSize: 8,
    color: '#6B7280',
    marginLeft: 2,
  },
  selectedDateSection: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  selectedDateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  noAppointments: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noAppointmentsText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  appointmentsList: {
    gap: 12,
  },
  appointmentCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  appointmentDetails: {
    gap: 8,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  appointmentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  typeText: {
    fontSize: 12,
    color: '#6A2CB0',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  notesText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});