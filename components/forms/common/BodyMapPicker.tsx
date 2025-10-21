/**
 * BodyMapPicker Component
 * Interactive body map for marking injury locations
 * Supports anterior and posterior views, male and female bodies
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BodyMapInjury } from '@/types/forms';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BODY_MAP_WIDTH = SCREEN_WIDTH - 64; // 32px padding on each side

interface BodyMapPickerProps {
  visible: boolean;
  onClose: () => void;
  injuries: BodyMapInjury[];
  onInjuriesChange: (injuries: BodyMapInjury[]) => void;
  gender?: 'male' | 'female';
}

// Body part regions for touch detection
const BODY_REGIONS = {
  anterior: {
    head: { x: 0.4, y: 0.05, width: 0.2, height: 0.1, label: 'Head/Face' },
    neck: { x: 0.42, y: 0.15, width: 0.16, height: 0.05, label: 'Neck' },
    chest: { x: 0.35, y: 0.2, width: 0.3, height: 0.15, label: 'Chest' },
    abdomen: { x: 0.37, y: 0.35, width: 0.26, height: 0.15, label: 'Abdomen' },
    pelvis: { x: 0.38, y: 0.5, width: 0.24, height: 0.1, label: 'Pelvis/Genitals' },
    leftArm: { x: 0.15, y: 0.2, width: 0.15, height: 0.3, label: 'Left Arm' },
    rightArm: { x: 0.7, y: 0.2, width: 0.15, height: 0.3, label: 'Right Arm' },
    leftLeg: { x: 0.35, y: 0.6, width: 0.15, height: 0.35, label: 'Left Leg' },
    rightLeg: { x: 0.5, y: 0.6, width: 0.15, height: 0.35, label: 'Right Leg' },
  },
  posterior: {
    head: { x: 0.4, y: 0.05, width: 0.2, height: 0.1, label: 'Back of Head' },
    neck: { x: 0.42, y: 0.15, width: 0.16, height: 0.05, label: 'Back of Neck' },
    upperBack: { x: 0.35, y: 0.2, width: 0.3, height: 0.15, label: 'Upper Back' },
    lowerBack: { x: 0.37, y: 0.35, width: 0.26, height: 0.15, label: 'Lower Back' },
    buttocks: { x: 0.38, y: 0.5, width: 0.24, height: 0.1, label: 'Buttocks/Anus' },
    leftArmBack: { x: 0.15, y: 0.2, width: 0.15, height: 0.3, label: 'Left Arm (Back)' },
    rightArmBack: { x: 0.7, y: 0.2, width: 0.15, height: 0.3, label: 'Right Arm (Back)' },
    leftLegBack: { x: 0.35, y: 0.6, width: 0.15, height: 0.35, label: 'Left Leg (Back)' },
    rightLegBack: { x: 0.5, y: 0.6, width: 0.15, height: 0.35, label: 'Right Leg (Back)' },
  },
};

const INJURY_TYPES = [
  { label: 'Bruise', value: 'bruise' },
  { label: 'Laceration', value: 'laceration' },
  { label: 'Bite Mark', value: 'bite_mark' },
  { label: 'Burn', value: 'burn' },
  { label: 'Other', value: 'other' },
];

export const BodyMapPicker: React.FC<BodyMapPickerProps> = ({
  visible,
  onClose,
  injuries,
  onInjuriesChange,
  gender = 'female',
}) => {
  const [activeView, setActiveView] = useState<'anterior' | 'posterior'>('anterior');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [injuryType, setInjuryType] = useState<string>('bruise');
  const [injuryDescription, setInjuryDescription] = useState('');

  const handleBodyPress = (regionKey: string, region: any) => {
    setSelectedRegion(regionKey);
  };

  const handleAddInjury = () => {
    if (!selectedRegion) return;

    const region = BODY_REGIONS[activeView][selectedRegion as keyof typeof BODY_REGIONS.anterior];

    const newInjury: BodyMapInjury = {
      id: `injury-${Date.now()}`,
      type: injuryType as any,
      location: region.label,
      coordinates: {
        x: region.x + region.width / 2,
        y: region.y + region.height / 2,
      },
      view: activeView,
      bodyPart: region.label,
      description: injuryDescription || `${injuryType} on ${region.label}`,
    };

    onInjuriesChange([...injuries, newInjury]);

    // Reset
    setSelectedRegion(null);
    setInjuryDescription('');
  };

  const handleRemoveInjury = (injuryId: string) => {
    onInjuriesChange(injuries.filter((inj) => inj.id !== injuryId));
  };

  const renderBodyMap = () => {
    const regions = BODY_REGIONS[activeView];

    return (
      <View style={styles.bodyMapContainer}>
        {/* Simple body outline */}
        <View style={styles.bodyOutline}>
          <Text style={styles.bodyOutlineText}>
            {activeView === 'anterior' ? '🧍 FRONT VIEW' : '🧍 BACK VIEW'}
          </Text>

          {/* Render clickable regions */}
          {Object.entries(regions).map(([key, region]) => {
            const isSelected = selectedRegion === key;
            const hasInjury = injuries.some(
              (inj) => inj.view === activeView && inj.bodyPart === region.label
            );

            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.bodyRegion,
                  {
                    left: `${region.x * 100}%`,
                    top: `${region.y * 100}%`,
                    width: `${region.width * 100}%`,
                    height: `${region.height * 100}%`,
                  },
                  isSelected && styles.bodyRegionSelected,
                  hasInjury && styles.bodyRegionWithInjury,
                ]}
                onPress={() => handleBodyPress(key, region)}
                activeOpacity={0.7}
              >
                <Text style={styles.bodyRegionLabel}>{region.label}</Text>
                {hasInjury && <Text style={styles.injuryMarker}>⚠️</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Body Map - Mark Injuries</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* View Toggle */}
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.viewButton, activeView === 'anterior' && styles.viewButtonActive]}
              onPress={() => setActiveView('anterior')}
            >
              <Text
                style={[
                  styles.viewButtonText,
                  activeView === 'anterior' && styles.viewButtonTextActive,
                ]}
              >
                Anterior (Front)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewButton, activeView === 'posterior' && styles.viewButtonActive]}
              onPress={() => setActiveView('posterior')}
            >
              <Text
                style={[
                  styles.viewButtonText,
                  activeView === 'posterior' && styles.viewButtonTextActive,
                ]}
              >
                Posterior (Back)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Body Map */}
          {renderBodyMap()}

          {/* Injury Type Selection */}
          {selectedRegion && (
            <View style={styles.injuryForm}>
              <Text style={styles.formTitle}>Add Injury to {selectedRegion}</Text>

              <View style={styles.injuryTypeContainer}>
                {INJURY_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.injuryTypeButton,
                      injuryType === type.value && styles.injuryTypeButtonActive,
                    ]}
                    onPress={() => setInjuryType(type.value)}
                  >
                    <Text
                      style={[
                        styles.injuryTypeText,
                        injuryType === type.value && styles.injuryTypeTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.addButton} onPress={handleAddInjury}>
                <Text style={styles.addButtonText}>✓ Add Injury</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSelectedRegion(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Injury List */}
          <View style={styles.injuryList}>
            <Text style={styles.injuryListTitle}>Marked Injuries ({injuries.length})</Text>
            {injuries.map((injury, index) => (
              <View key={injury.id} style={styles.injuryCard}>
                <View style={styles.injuryCardContent}>
                  <Text style={styles.injuryCardTitle}>
                    {index + 1}. {injury.type.replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.injuryCardLocation}>
                    {injury.location} ({injury.view})
                  </Text>
                  <Text style={styles.injuryCardDescription}>{injury.description}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveInjury(injury.id)}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  content: {
    flex: 1,
  },
  viewToggle: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#6A2CB0',
  },
  viewButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  viewButtonActive: {
    backgroundColor: '#6A2CB0',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A2CB0',
  },
  viewButtonTextActive: {
    color: '#FFFFFF',
  },
  bodyMapContainer: {
    margin: 16,
    alignItems: 'center',
  },
  bodyOutline: {
    width: BODY_MAP_WIDTH,
    height: BODY_MAP_WIDTH * 1.5,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#6A2CB0',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyOutlineText: {
    fontSize: 24,
    color: '#6A2CB0',
    fontWeight: 'bold',
  },
  bodyRegion: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    backgroundColor: 'rgba(106, 44, 176, 0.1)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  bodyRegionSelected: {
    backgroundColor: 'rgba(106, 44, 176, 0.3)',
    borderColor: '#6A2CB0',
    borderWidth: 2,
  },
  bodyRegionWithInjury: {
    backgroundColor: 'rgba(211, 47, 47, 0.2)',
    borderColor: '#D32F2F',
  },
  bodyRegionLabel: {
    fontSize: 8,
    color: '#424242',
    textAlign: 'center',
    fontWeight: '600',
  },
  injuryMarker: {
    fontSize: 16,
    marginTop: 2,
  },
  injuryForm: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  injuryTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  injuryTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6A2CB0',
    backgroundColor: '#FFFFFF',
  },
  injuryTypeButtonActive: {
    backgroundColor: '#6A2CB0',
  },
  injuryTypeText: {
    fontSize: 14,
    color: '#6A2CB0',
  },
  injuryTypeTextActive: {
    color: '#FFFFFF',
  },
  addButton: {
    paddingVertical: 12,
    backgroundColor: '#6A2CB0',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#757575',
  },
  injuryList: {
    margin: 16,
  },
  injuryListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  injuryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  injuryCardContent: {
    flex: 1,
  },
  injuryCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  injuryCardLocation: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  },
  injuryCardDescription: {
    fontSize: 12,
    color: '#616161',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  removeButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
