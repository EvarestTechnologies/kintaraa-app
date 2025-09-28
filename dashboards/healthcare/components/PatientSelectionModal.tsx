import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {
  X,
  User,
  Phone,
  MapPin,
  ChevronRight,
} from 'lucide-react-native';
import type { Patient } from '../index';

interface PatientSelectionModalProps {
  visible: boolean;
  patients: Patient[];
  onClose: () => void;
  onSelectPatient: (patient: Patient) => void;
}

export default function PatientSelectionModal({
  visible,
  patients,
  onClose,
  onSelectPatient,
}: PatientSelectionModalProps) {
  const handleSelectPatient = (patient: Patient) => {
    onSelectPatient(patient);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Select Patient</Text>
            <Text style={styles.subtitle}>Choose a patient to schedule an appointment</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {patients.length === 0 ? (
            <View style={styles.emptyState}>
              <User color="#9CA3AF" size={48} />
              <Text style={styles.emptyTitle}>No Patients Available</Text>
              <Text style={styles.emptyDescription}>
                You need to have assigned patients before scheduling appointments.
              </Text>
            </View>
          ) : (
            patients.map((patient) => (
              <TouchableOpacity
                key={patient.id}
                style={styles.patientCard}
                onPress={() => handleSelectPatient(patient)}
              >
                <View style={styles.patientInfo}>
                  <View style={styles.patientHeader}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientDetails}>
                      {patient.age} years • {patient.gender}
                    </Text>
                  </View>

                  <View style={styles.contactInfo}>
                    <View style={styles.infoRow}>
                      <Phone color="#6B7280" size={14} />
                      <Text style={styles.infoText}>{patient.phone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <MapPin color="#6B7280" size={14} />
                      <Text style={styles.infoText} numberOfLines={1}>
                        {patient.address}
                      </Text>
                    </View>
                  </View>
                </View>

                <ChevronRight color="#9CA3AF" size={20} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  patientInfo: {
    flex: 1,
  },
  patientHeader: {
    marginBottom: 8,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  patientDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  contactInfo: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
});