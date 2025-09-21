import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  X,
} from 'lucide-react-native';
import type { CourtHearing } from '../index';

interface CalendarViewProps {
  hearings: CourtHearing[];
  onHearingPress: (hearing: CourtHearing) => void;
  onEditHearing: (hearing: CourtHearing) => void;
  onDeleteHearing: (hearing: CourtHearing) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hearings: CourtHearing[];
}

export default function CalendarView({
  hearings,
  onHearingPress,
  onEditHearing,
  onDeleteHearing
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);

  const today = new Date();

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Start from Sunday of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // End on Saturday of the week containing the last day
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days: CalendarDay[] = [];
    const currentDateLoop = new Date(startDate);

    while (currentDateLoop <= endDate) {
      const dateStr = currentDateLoop.toISOString().split('T')[0];
      const dayHearings = hearings.filter(h => h.date === dateStr);

      days.push({
        date: new Date(currentDateLoop),
        isCurrentMonth: currentDateLoop.getMonth() === month,
        isToday: currentDateLoop.toDateString() === today.toDateString(),
        hearings: dayHearings,
      });

      currentDateLoop.setDate(currentDateLoop.getDate() + 1);
    }

    return days;
  }, [currentDate, hearings, today]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDayPress = (day: CalendarDay) => {
    if (day.hearings.length > 0) {
      setSelectedDate(day.date);
      setShowDayModal(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#F59E0B';
      case 'confirmed': return '#10B981';
      case 'postponed': return '#8B5CF6';
      case 'completed': return '#6B7280';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock size={14} color={getStatusColor(status)} />;
      case 'confirmed': return <CheckCircle size={14} color={getStatusColor(status)} />;
      case 'postponed': return <Pause size={14} color={getStatusColor(status)} />;
      case 'completed': return <CheckCircle size={14} color={getStatusColor(status)} />;
      case 'cancelled': return <XCircle size={14} color={getStatusColor(status)} />;
      default: return <Clock size={14} color={getStatusColor(status)} />;
    }
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const selectedDateHearings = selectedDate
    ? hearings.filter(h => h.date === selectedDate.toISOString().split('T')[0])
    : [];

  const renderCalendarDay = (day: CalendarDay, index: number) => {
    const hasHearings = day.hearings.length > 0;
    const hasUrgent = day.hearings.some(h => h.priority === 'urgent');
    const hasMultiple = day.hearings.length > 1;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.calendarDay,
          !day.isCurrentMonth && styles.calendarDayOtherMonth,
          day.isToday && styles.calendarDayToday,
          hasHearings && styles.calendarDayWithHearings,
          hasUrgent && styles.calendarDayUrgent,
        ]}
        onPress={() => handleDayPress(day)}
        disabled={!hasHearings}
      >
        <Text style={[
          styles.calendarDayText,
          !day.isCurrentMonth && styles.calendarDayTextOtherMonth,
          day.isToday && styles.calendarDayTextToday,
          hasHearings && styles.calendarDayTextWithHearings,
        ]}>
          {day.date.getDate()}
        </Text>

        {hasHearings && (
          <View style={styles.hearingIndicators}>
            {hasMultiple ? (
              <View style={[styles.hearingDot, styles.hearingDotMultiple]}>
                <Text style={styles.hearingCount}>{day.hearings.length}</Text>
              </View>
            ) : (
              <View style={[
                styles.hearingDot,
                { backgroundColor: getStatusColor(day.hearings[0].status) }
              ]} />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderHearingItem = ({ item: hearing }: { item: CourtHearing }) => (
    <TouchableOpacity
      style={styles.hearingItem}
      onPress={() => onHearingPress(hearing)}
    >
      <View style={styles.hearingHeader}>
        <View style={styles.hearingTime}>
          <Clock color="#6B7280" size={16} />
          <Text style={styles.hearingTimeText}>{hearing.time}</Text>
        </View>
        <View style={styles.hearingStatus}>
          {getStatusIcon(hearing.status)}
        </View>
      </View>

      <Text style={styles.hearingTitle}>
        {hearing.type.charAt(0).toUpperCase() + hearing.type.slice(1)}
      </Text>
      <Text style={styles.hearingCase}>{hearing.caseName}</Text>

      <View style={styles.hearingLocation}>
        <MapPin color="#9CA3AF" size={14} />
        <Text style={styles.hearingLocationText}>{hearing.location}</Text>
      </View>

      {hearing.priority === 'urgent' && (
        <View style={styles.urgentBadge}>
          <AlertTriangle color="#EF4444" size={12} />
          <Text style={styles.urgentText}>Urgent</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Calendar Header */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('prev')}
        >
          <ChevronLeft color="#6B7280" size={24} />
        </TouchableOpacity>

        <Text style={styles.monthTitle}>{formatMonthYear(currentDate)}</Text>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('next')}
        >
          <ChevronRight color="#6B7280" size={24} />
        </TouchableOpacity>
      </View>

      {/* Days of Week Header */}
      <View style={styles.weekHeader}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Text key={day} style={styles.weekDay}>{day}</Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => renderCalendarDay(day, index))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendText}>Scheduled</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Confirmed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.hearingDotMultiple]}>
              <Text style={styles.hearingCount}>2+</Text>
            </View>
            <Text style={styles.legendText}>Multiple</Text>
          </View>
        </View>
      </View>

      {/* Day Details Modal */}
      <Modal
        visible={showDayModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDayModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <Calendar color="#3B82F6" size={24} />
              <Text style={styles.modalTitle}>
                {selectedDate ? formatSelectedDate(selectedDate) : ''}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDayModal(false)}
            >
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.hearingsCount}>
              {selectedDateHearings.length} hearing{selectedDateHearings.length !== 1 ? 's' : ''} scheduled
            </Text>

            <FlatList
              data={selectedDateHearings}
              keyExtractor={(item) => item.id}
              renderItem={renderHearingItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.hearingsList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  weekHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  calendarDayOtherMonth: {
    backgroundColor: '#F8FAFC',
  },
  calendarDayToday: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  calendarDayWithHearings: {
    backgroundColor: '#FEF3C7',
  },
  calendarDayUrgent: {
    backgroundColor: '#FEF2F2',
  },
  calendarDayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  calendarDayTextOtherMonth: {
    color: '#9CA3AF',
  },
  calendarDayTextToday: {
    color: '#3B82F6',
    fontWeight: '700',
  },
  calendarDayTextWithHearings: {
    color: '#92400E',
    fontWeight: '600',
  },
  hearingIndicators: {
    position: 'absolute',
    bottom: 4,
    alignItems: 'center',
  },
  hearingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  hearingDotMultiple: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hearingCount: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  legend: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  hearingsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  hearingsList: {
    gap: 12,
  },
  hearingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  hearingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hearingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hearingTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  hearingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hearingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  hearingCase: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  hearingLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hearingLocationText: {
    fontSize: 12,
    color: '#9CA3AF',
    flex: 1,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#DC2626',
  },
});