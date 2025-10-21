/**
 * P3 Form - Section 4: Evidence Collection & Chain of Custody
 * Kenya Police Medical Examination Form
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  FormSection,
  FormTextField,
  FormCheckboxGroup,
  FormTextArea,
  FormRadioGroup,
  FormDateTimePicker,
} from '@/components/forms/common';
import { P3EvidenceCollection, EvidenceItem } from '@/types/forms';

interface P3Section4Props {
  evidenceData: P3EvidenceCollection;
  onUpdate: (data: Partial<P3EvidenceCollection>) => void;
  errors?: Partial<Record<keyof P3EvidenceCollection, string>>;
}

export const P3Section4_EvidenceCollection: React.FC<P3Section4Props> = ({
  evidenceData,
  onUpdate,
  errors = {},
}) => {
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const handleAddEvidenceItem = () => {
    const newItem: EvidenceItem = {
      id: Date.now().toString(),
      itemType: 'clothing',
      itemDescription: '',
      collectedDate: new Date().toISOString().split('T')[0],
      collectedTime: new Date().toTimeString().slice(0, 5),
      collectedBy: '',
      storageLocation: '',
      sealed: false,
    };

    onUpdate({
      evidenceItems: [...evidenceData.evidenceItems, newItem],
    });
    setEditingItemIndex(evidenceData.evidenceItems.length);
  };

  const handleUpdateEvidenceItem = (index: number, updates: Partial<EvidenceItem>) => {
    const updatedItems = [...evidenceData.evidenceItems];
    updatedItems[index] = { ...updatedItems[index], ...updates };
    onUpdate({ evidenceItems: updatedItems });
  };

  const handleRemoveEvidenceItem = (index: number) => {
    const updatedItems = evidenceData.evidenceItems.filter((_, i) => i !== index);
    onUpdate({ evidenceItems: updatedItems });
    if (editingItemIndex === index) {
      setEditingItemIndex(null);
    }
  };

  const handleForensicSampleChange = (key: string, checked: boolean) => {
    onUpdate({
      forensicSamples: {
        ...evidenceData.forensicSamples,
        [key]: checked,
      },
    });
  };

  return (
    <FormSection
      sectionNumber="Section 4"
      title="EVIDENCE COLLECTION & CHAIN OF CUSTODY"
      subtitle="Document all evidence collected and maintain chain of custody"
      required={true}
      defaultExpanded={true}
    >
      {/* Forensic Samples Checklist */}
      <View style={styles.forensicSamplesSection}>
        <Text style={styles.forensicSamplesTitle}>Forensic Samples Collected</Text>
        <Text style={styles.forensicSamplesSubtitle}>
          Check all samples that were collected during examination
        </Text>

        <FormCheckboxGroup
          label="Sample types"
          options={[
            { label: 'Blood sample', value: 'bloodSample' },
            { label: 'Urine sample', value: 'urineSample' },
            { label: 'Vaginal swabs', value: 'vaginalSwabs' },
            { label: 'Oral swabs', value: 'oralSwabs' },
            { label: 'Anal swabs', value: 'analSwabs' },
            { label: 'Nail clippings', value: 'nailClippings' },
            { label: 'Hair samples', value: 'hairSamples' },
            { label: 'Skin swabs', value: 'skinSwabs' },
            { label: 'Other (Specify)', value: 'other' },
          ]}
          selectedValues={Object.keys(evidenceData.forensicSamples).filter(
            (key) => evidenceData.forensicSamples[key as keyof typeof evidenceData.forensicSamples] === true
          )}
          onValueChange={(value, checked) => handleForensicSampleChange(value, checked)}
          helpText="Select all applicable forensic samples"
        />

        {evidenceData.forensicSamples.other && (
          <FormTextField
            label="Specify other forensic samples"
            value={evidenceData.forensicSamples.otherSpecify || ''}
            onChangeText={(text) =>
              onUpdate({
                forensicSamples: {
                  ...evidenceData.forensicSamples,
                  otherSpecify: text,
                },
              })
            }
            placeholder="Describe other forensic samples collected"
            required={true}
          />
        )}
      </View>

      {/* Evidence Items List */}
      <View style={styles.evidenceItemsSection}>
        <Text style={styles.evidenceItemsTitle}>Evidence Items</Text>
        <Text style={styles.evidenceItemsSubtitle}>
          Document each piece of physical evidence collected
        </Text>

        <TouchableOpacity style={styles.addEvidenceButton} onPress={handleAddEvidenceItem}>
          <Text style={styles.addEvidenceButtonText}>+ Add Evidence Item</Text>
        </TouchableOpacity>

        {evidenceData.evidenceItems.map((item, index) => (
          <View key={item.id} style={styles.evidenceCard}>
            <View style={styles.evidenceCardHeader}>
              <Text style={styles.evidenceCardTitle}>Evidence Item {index + 1}</Text>
              <TouchableOpacity
                style={styles.removeEvidenceButton}
                onPress={() => handleRemoveEvidenceItem(index)}
              >
                <Text style={styles.removeEvidenceButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>

            {/* Item Type */}
            <FormRadioGroup
              label="Item type"
              options={[
                { label: 'Clothing', value: 'clothing' },
                { label: 'Swab', value: 'swab' },
                { label: 'Blood sample', value: 'blood_sample' },
                { label: 'Hair sample', value: 'hair_sample' },
                { label: 'Nail clippings', value: 'nail_clippings' },
                { label: 'Other', value: 'other' },
              ]}
              value={item.itemType}
              onValueChange={(value) => handleUpdateEvidenceItem(index, { itemType: value as any })}
              required={true}
              horizontal={false}
            />

            {/* Item Description */}
            <FormTextArea
              label="Item description"
              value={item.itemDescription}
              onChangeText={(text) => handleUpdateEvidenceItem(index, { itemDescription: text })}
              placeholder="Detailed description of evidence item (color, brand, condition, identifying marks)"
              rows={3}
              required={true}
              helpText="Be as specific as possible for identification"
            />

            {/* Collection Date & Time */}
            <FormDateTimePicker
              label="Collection date & time"
              mode="both"
              dateValue={{
                day: new Date(item.collectedDate).getDate().toString(),
                month: (new Date(item.collectedDate).getMonth() + 1).toString(),
                year: new Date(item.collectedDate).getFullYear().toString(),
              }}
              timeValue={{
                hour: item.collectedTime.split(':')[0],
                minute: item.collectedTime.split(':')[1],
                period: 'AM',
              }}
              onDateChange={(date) => {
                if (date.day && date.month && date.year) {
                  const isoDate = `${date.year}-${date.month.padStart(2, '0')}-${date.day.padStart(2, '0')}`;
                  handleUpdateEvidenceItem(index, { collectedDate: isoDate });
                }
              }}
              onTimeChange={(time) => {
                if (time.hour && time.minute) {
                  const timeStr = `${time.hour.padStart(2, '0')}:${time.minute.padStart(2, '0')}`;
                  handleUpdateEvidenceItem(index, { collectedTime: timeStr });
                }
              }}
              required={true}
            />

            {/* Collected By */}
            <FormTextField
              label="Collected by"
              value={item.collectedBy}
              onChangeText={(text) => handleUpdateEvidenceItem(index, { collectedBy: text })}
              placeholder="Name of officer who collected evidence"
              required={true}
            />

            {/* Witnessed By */}
            <FormTextField
              label="Witnessed by (optional)"
              value={item.witnessedBy || ''}
              onChangeText={(text) => handleUpdateEvidenceItem(index, { witnessedBy: text })}
              placeholder="Name of witness to collection"
              helpText="If another officer or medical professional witnessed collection"
            />

            {/* Storage Location */}
            <FormTextField
              label="Storage location"
              value={item.storageLocation}
              onChangeText={(text) => handleUpdateEvidenceItem(index, { storageLocation: text })}
              placeholder="Where evidence is currently stored"
              required={true}
              helpText="e.g., Evidence room, Police station locker #5"
            />

            {/* Sealed Status */}
            <FormRadioGroup
              label="Sealed?"
              options={[
                { label: 'Yes - Sealed', value: 'yes' },
                { label: 'No - Not sealed', value: 'no' },
              ]}
              value={item.sealed ? 'yes' : 'no'}
              onValueChange={(value) =>
                handleUpdateEvidenceItem(index, { sealed: value === 'yes' })
              }
              required={true}
              horizontal={true}
              helpText="Evidence should be sealed in tamper-evident packaging"
            />

            {item.sealed && (
              <FormTextField
                label="Seal number"
                value={item.sealNumber || ''}
                onChangeText={(text) => handleUpdateEvidenceItem(index, { sealNumber: text })}
                placeholder="Unique seal/tag number"
                required={true}
                helpText="Tamper-evident seal or tag identification number"
              />
            )}

            {/* Notes */}
            <FormTextArea
              label="Additional notes"
              value={item.notes || ''}
              onChangeText={(text) => handleUpdateEvidenceItem(index, { notes: text })}
              placeholder="Any additional relevant information about this evidence item"
              rows={2}
            />
          </View>
        ))}

        {evidenceData.evidenceItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No evidence items documented yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap "Add Evidence Item" to begin</Text>
          </View>
        )}
      </View>

      {/* Chain of Custody Section */}
      <View style={styles.chainOfCustodySection}>
        <Text style={styles.chainOfCustodyTitle}>⚖️ Chain of Custody</Text>
        <Text style={styles.chainOfCustodySubtitle}>
          Legal documentation of evidence handling and transfer
        </Text>

        {/* Collected By */}
        <View style={styles.custodySubsection}>
          <Text style={styles.custodySubsectionTitle}>Collected By</Text>

          <FormTextField
            label="Name"
            value={evidenceData.chainOfCustody.collectedBy.name}
            onChangeText={(text) =>
              onUpdate({
                chainOfCustody: {
                  ...evidenceData.chainOfCustody,
                  collectedBy: {
                    ...evidenceData.chainOfCustody.collectedBy,
                    name: text,
                  },
                },
              })
            }
            placeholder="Full name"
            required={true}
          />

          <FormTextField
            label="Rank"
            value={evidenceData.chainOfCustody.collectedBy.rank}
            onChangeText={(text) =>
              onUpdate({
                chainOfCustody: {
                  ...evidenceData.chainOfCustody,
                  collectedBy: {
                    ...evidenceData.chainOfCustody.collectedBy,
                    rank: text,
                  },
                },
              })
            }
            placeholder="Police rank"
            required={true}
          />

          <FormTextField
            label="Service number"
            value={evidenceData.chainOfCustody.collectedBy.serviceNumber}
            onChangeText={(text) =>
              onUpdate({
                chainOfCustody: {
                  ...evidenceData.chainOfCustody,
                  collectedBy: {
                    ...evidenceData.chainOfCustody.collectedBy,
                    serviceNumber: text,
                  },
                },
              })
            }
            placeholder="Police service number"
            required={true}
          />

          <FormTextField
            label="Signature"
            value={evidenceData.chainOfCustody.collectedBy.signature || ''}
            onChangeText={(text) =>
              onUpdate({
                chainOfCustody: {
                  ...evidenceData.chainOfCustody,
                  collectedBy: {
                    ...evidenceData.chainOfCustody.collectedBy,
                    signature: text,
                  },
                },
              })
            }
            placeholder="Digital signature or initials"
            helpText="Enter initials or 'SIGNED' to confirm"
          />

          <FormDateTimePicker
            label="Date"
            mode="date"
            dateValue={{
              day: evidenceData.chainOfCustody.collectedBy.date
                ? new Date(evidenceData.chainOfCustody.collectedBy.date).getDate().toString()
                : '',
              month: evidenceData.chainOfCustody.collectedBy.date
                ? (new Date(evidenceData.chainOfCustody.collectedBy.date).getMonth() + 1).toString()
                : '',
              year: evidenceData.chainOfCustody.collectedBy.date
                ? new Date(evidenceData.chainOfCustody.collectedBy.date).getFullYear().toString()
                : '',
            }}
            onDateChange={(date) => {
              if (date.day && date.month && date.year) {
                const isoDate = `${date.year}-${date.month.padStart(2, '0')}-${date.day.padStart(2, '0')}`;
                onUpdate({
                  chainOfCustody: {
                    ...evidenceData.chainOfCustody,
                    collectedBy: {
                      ...evidenceData.chainOfCustody.collectedBy,
                      date: isoDate,
                    },
                  },
                });
              }
            }}
            required={true}
          />
        </View>

        {/* Witnessed By (Optional) */}
        <View style={styles.custodySubsection}>
          <Text style={styles.custodySubsectionTitle}>Witnessed By (Optional)</Text>

          <FormTextField
            label="Name"
            value={evidenceData.chainOfCustody.witnessedBy?.name || ''}
            onChangeText={(text) =>
              onUpdate({
                chainOfCustody: {
                  ...evidenceData.chainOfCustody,
                  witnessedBy: {
                    ...evidenceData.chainOfCustody.witnessedBy,
                    name: text,
                    role: evidenceData.chainOfCustody.witnessedBy?.role || '',
                    date: evidenceData.chainOfCustody.witnessedBy?.date || new Date().toISOString().split('T')[0],
                  },
                },
              })
            }
            placeholder="Witness full name"
          />

          <FormTextField
            label="Role"
            value={evidenceData.chainOfCustody.witnessedBy?.role || ''}
            onChangeText={(text) =>
              onUpdate({
                chainOfCustody: {
                  ...evidenceData.chainOfCustody,
                  witnessedBy: {
                    ...evidenceData.chainOfCustody.witnessedBy,
                    name: evidenceData.chainOfCustody.witnessedBy?.name || '',
                    role: text,
                    date: evidenceData.chainOfCustody.witnessedBy?.date || new Date().toISOString().split('T')[0],
                  },
                },
              })
            }
            placeholder="Position or role"
          />
        </View>

        {/* Storage Details */}
        <View style={styles.custodySubsection}>
          <Text style={styles.custodySubsectionTitle}>Storage Details</Text>

          <FormTextField
            label="Storage location"
            value={evidenceData.chainOfCustody.storageLocation}
            onChangeText={(text) =>
              onUpdate({
                chainOfCustody: {
                  ...evidenceData.chainOfCustody,
                  storageLocation: text,
                },
              })
            }
            placeholder="Where evidence is stored"
            required={true}
          />

          <FormDateTimePicker
            label="Storage date"
            mode="date"
            dateValue={{
              day: evidenceData.chainOfCustody.storageDate
                ? new Date(evidenceData.chainOfCustody.storageDate).getDate().toString()
                : '',
              month: evidenceData.chainOfCustody.storageDate
                ? (new Date(evidenceData.chainOfCustody.storageDate).getMonth() + 1).toString()
                : '',
              year: evidenceData.chainOfCustody.storageDate
                ? new Date(evidenceData.chainOfCustody.storageDate).getFullYear().toString()
                : '',
            }}
            onDateChange={(date) => {
              if (date.day && date.month && date.year) {
                const isoDate = `${date.year}-${date.month.padStart(2, '0')}-${date.day.padStart(2, '0')}`;
                onUpdate({
                  chainOfCustody: {
                    ...evidenceData.chainOfCustody,
                    storageDate: isoDate,
                  },
                });
              }
            }}
            required={true}
          />

          <FormTextField
            label="Storage temperature (optional)"
            value={evidenceData.chainOfCustody.storageTemperature || ''}
            onChangeText={(text) =>
              onUpdate({
                chainOfCustody: {
                  ...evidenceData.chainOfCustody,
                  storageTemperature: text,
                },
              })
            }
            placeholder="e.g., Room temperature, Refrigerated, -20°C"
            helpText="Required for biological samples"
          />
        </View>
      </View>

      {/* Evidence Notes */}
      <FormTextArea
        label="Evidence collection notes"
        value={evidenceData.evidenceNotes || ''}
        onChangeText={(text) => onUpdate({ evidenceNotes: text })}
        placeholder="Any additional notes about evidence collection, chain of custody, or special handling requirements"
        rows={3}
        helpText="Document any issues, delays, or special circumstances"
      />

      {/* Guidelines */}
      <View style={styles.guidelinesSection}>
        <Text style={styles.guidelinesTitle}>📋 Evidence Handling Guidelines</Text>
        <Text style={styles.guidelinesText}>
          • All evidence must be properly labeled with case number, date, and collector's initials
        </Text>
        <Text style={styles.guidelinesText}>
          • Use tamper-evident seals on all evidence containers
        </Text>
        <Text style={styles.guidelinesText}>
          • Maintain continuous custody documentation for court admissibility
        </Text>
        <Text style={styles.guidelinesText}>
          • Store biological samples in appropriate conditions (refrigerated/frozen)
        </Text>
        <Text style={styles.guidelinesText}>
          • Photograph all evidence before packaging when possible
        </Text>
        <Text style={styles.guidelinesText}>
          • Keep evidence in secure, access-controlled storage
        </Text>
        <Text style={styles.guidelinesText}>
          • Document all transfers and handlers in chain of custody
        </Text>
      </View>
    </FormSection>
  );
};

const styles = StyleSheet.create({
  forensicSamplesSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6A2CB0',
  },
  forensicSamplesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A2CB0',
    marginBottom: 4,
  },
  forensicSamplesSubtitle: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 12,
  },
  evidenceItemsSection: {
    marginBottom: 24,
  },
  evidenceItemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  evidenceItemsSubtitle: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 12,
  },
  addEvidenceButton: {
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: 16,
  },
  addEvidenceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  evidenceCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  evidenceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  evidenceCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6A2CB0',
  },
  removeEvidenceButton: {
    padding: 6,
    backgroundColor: '#FFEBEE',
    borderRadius: 4,
  },
  removeEvidenceButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C62828',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  chainOfCustodySection: {
    marginTop: 24,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFA000',
  },
  chainOfCustodyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  chainOfCustodySubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  custodySubsection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFA000',
  },
  custodySubsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  guidelinesSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 12,
  },
  guidelinesText: {
    fontSize: 12,
    color: '#424242',
    marginBottom: 6,
    lineHeight: 18,
  },
});
