import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { P3ChainOfCustody, P3ChainOfCustodyEntry } from '@/types/forms/P3Form_Official';
import { FormTextField } from '@/components/forms/common/FormTextField';

interface P3ChainOfCustodyProps {
  chainOfCustody: P3ChainOfCustody;
  onUpdate: (updates: Partial<P3ChainOfCustody>) => void;
}

const P3ChainOfCustodyComponent: React.FC<P3ChainOfCustodyProps> = ({
  chainOfCustody,
  onUpdate,
}) => {
  const handleEntryUpdate = (index: number, field: keyof P3ChainOfCustodyEntry, value: string | number) => {
    const updatedEntries = [...chainOfCustody.entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value,
    };
    onUpdate({ entries: updatedEntries });
  };

  const addEvidenceRow = () => {
    const newRow: P3ChainOfCustodyEntry = {
      serialNumber: chainOfCustody.entries.length + 1,
      evidenceItemDescription: '',
      evidenceReceivedFrom: '',
      evidenceDeliveredTo: '',
      date: '',
      commentsRemarks: '',
    };
    onUpdate({
      entries: [...chainOfCustody.entries, newRow],
    });
  };

  const handleCollectedByUpdate = (updates: Partial<typeof chainOfCustody.collectedBy>) => {
    onUpdate({
      collectedBy: {
        ...chainOfCustody.collectedBy,
        ...updates,
      },
    });
  };

  const handleReceivedByUpdate = (updates: Partial<typeof chainOfCustody.receivedBy>) => {
    onUpdate({
      receivedBy: {
        ...chainOfCustody.receivedBy,
        ...updates,
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CHAIN OF CUSTODY</Text>
        <Text style={styles.headerSubtitle}>Forensic Evidence Tracking</Text>
      </View>

      {/* Legal Alert Box */}
      <View style={styles.legalAlertBox}>
        <Text style={styles.legalAlertIcon}>⚖️</Text>
        <View style={styles.legalAlertContent}>
          <Text style={styles.legalAlertTitle}>LEGAL REQUIREMENT</Text>
          <Text style={styles.legalAlertText}>
            Proper chain of custody documentation is REQUIRED for evidence admissibility in court.
            All transfers must be documented with signatures, dates, and times.
          </Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsBox}>
        <Text style={styles.instructionsTitle}>INSTRUCTIONS:</Text>
        <Text style={styles.instructionsText}>
          1. Record ALL specimens collected during the examination{'\n'}
          2. Document every transfer of evidence with full details{'\n'}
          3. Ensure both medical practitioner AND police officer signatures{'\n'}
          4. Include facility stamp/seal where applicable{'\n'}
          5. Maintain continuous custody documentation until submission to forensic lab
        </Text>
      </View>

      {/* Evidence Tracking Table */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>EVIDENCE TRACKING LOG</Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>S/N</Text>
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>EVIDENCE DESCRIPTION</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>RECEIVED FROM</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>DELIVERED TO</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>DATE</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>COMMENTS</Text>
        </View>

        {/* Table Rows */}
        {chainOfCustody.entries.map((entry, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={[styles.tableCell, { flex: 0.5 }]}>
              <Text style={styles.serialNumber}>{entry.serialNumber}</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <FormTextField
                label=""
                value={entry.evidenceItemDescription}
                onChangeText={(text: string) => handleEntryUpdate(index, 'evidenceItemDescription', text)}
                placeholder="e.g., High vaginal swab, Blood sample, Clothing"
                required={true}
              />
            </View>
            <View style={[styles.tableCell, { flex: 1.5 }]}>
              <FormTextField
                label=""
                value={entry.evidenceReceivedFrom}
                onChangeText={(text: string) => handleEntryUpdate(index, 'evidenceReceivedFrom', text)}
                placeholder="Name & designation"
                required={true}
              />
            </View>
            <View style={[styles.tableCell, { flex: 1.5 }]}>
              <FormTextField
                label=""
                value={entry.evidenceDeliveredTo}
                onChangeText={(text: string) => handleEntryUpdate(index, 'evidenceDeliveredTo', text)}
                placeholder="Name & designation"
                required={true}
              />
            </View>
            <View style={[styles.tableCell, { flex: 1 }]}>
              <FormTextField
                label=""
                value={entry.date}
                onChangeText={(text: string) => handleEntryUpdate(index, 'date', text)}
                placeholder="DD/MM/YYYY"
                required={true}
              />
            </View>
            <View style={[styles.tableCell, { flex: 1.5 }]}>
              <FormTextField
                label=""
                value={entry.commentsRemarks || ''}
                onChangeText={(text: string) => handleEntryUpdate(index, 'commentsRemarks', text)}
                placeholder="Condition, packaging, etc."
              />
            </View>
          </View>
        ))}

        {/* Add Row Button */}
        <TouchableOpacity style={styles.addRowButton} onPress={addEvidenceRow}>
          <Text style={styles.addRowButtonText}>+ Add Evidence Item</Text>
        </TouchableOpacity>
      </View>

      {/* Specimens Collected By (Medical Practitioner) */}
      <View style={styles.section}>
        <View style={[styles.sectionHeader, styles.practitionerHeader]}>
          <Text style={styles.sectionTitle}>SPECIMENS COLLECTED BY (MEDICAL PRACTITIONER)</Text>
        </View>

        <View style={styles.signatureGrid}>
          <View style={styles.signatureColumn}>
            <FormTextField
              label="Medical Practitioner Name"
              value={chainOfCustody.collectedBy.fullName}
              onChangeText={(text: string) =>
                handleCollectedByUpdate({ fullName: text })
              }
              placeholder="Full name"
              required={true}
            />
          </View>

          <View style={styles.signatureColumn}>
            <FormTextField
              label="Date Collected"
              value={chainOfCustody.collectedBy.collectionDate}
              onChangeText={(text: string) =>
                handleCollectedByUpdate({ collectionDate: text })
              }
              placeholder="DD/MM/YYYY"
              required={true}
            />
          </View>
        </View>

        <View style={styles.signatureGrid}>
          <View style={styles.signatureColumn}>
            <FormTextField
              label="Time Collected"
              value={chainOfCustody.collectedBy.collectionTime}
              onChangeText={(text: string) =>
                handleCollectedByUpdate({ collectionTime: text })
              }
              placeholder="HH:MM (24-hour)"
              required={true}
            />
          </View>

          <View style={styles.signatureColumn}>
            <FormTextField
              label="Facility Stamp/Seal"
              value={chainOfCustody.collectedBy.facilityStamp || ''}
              onChangeText={(text: string) =>
                handleCollectedByUpdate({ facilityStamp: text })
              }
              placeholder="Date clearly marked"
            />
          </View>
        </View>

        {/* Signature Box */}
        <View style={styles.signatureBox}>
          <Text style={styles.signatureLabel}>Signature of Medical Practitioner:</Text>
          <View style={styles.signatureLine}>
            <Text style={styles.signaturePlaceholder}>
              {chainOfCustody.practitionerSignature
                ? '✓ Signature captured'
                : 'Tap to sign'}
            </Text>
          </View>
        </View>
      </View>

      {/* Specimens Received By (Police Officer) */}
      <View style={styles.section}>
        <View style={[styles.sectionHeader, styles.policeHeader]}>
          <Text style={styles.sectionTitle}>SPECIMENS RECEIVED BY (POLICE OFFICER)</Text>
        </View>

        <View style={styles.signatureGrid}>
          <View style={styles.signatureColumn}>
            <FormTextField
              label="Police Officer Name & Service Number"
              value={chainOfCustody.receivedBy.fullNameServiceNumber}
              onChangeText={(text: string) =>
                handleReceivedByUpdate({ fullNameServiceNumber: text })
              }
              placeholder="Name (Service Number)"
              required={true}
            />
          </View>

          <View style={styles.signatureColumn}>
            <FormTextField
              label="Date Received"
              value={chainOfCustody.receivedBy.receivedDate}
              onChangeText={(text: string) =>
                handleReceivedByUpdate({ receivedDate: text })
              }
              placeholder="DD/MM/YYYY"
              required={true}
            />
          </View>
        </View>

        <View style={styles.signatureGrid}>
          <View style={styles.signatureColumn}>
            <FormTextField
              label="Time Received"
              value={chainOfCustody.receivedBy.receivedTime}
              onChangeText={(text: string) =>
                handleReceivedByUpdate({ receivedTime: text })
              }
              placeholder="HH:MM (24-hour)"
              required={true}
            />
          </View>

          <View style={styles.signatureColumn}>
            <FormTextField
              label="Police Station Stamp/Seal"
              value={chainOfCustody.receivedBy.facilityStamp || ''}
              onChangeText={(text: string) =>
                handleReceivedByUpdate({ facilityStamp: text })
              }
              placeholder="Date clearly marked"
            />
          </View>
        </View>

        {/* Signature Box */}
        <View style={styles.signatureBox}>
          <Text style={styles.signatureLabel}>Signature of Police Officer:</Text>
          <View style={styles.signatureLine}>
            <Text style={styles.signaturePlaceholder}>
              {chainOfCustody.policeOfficerSignature
                ? '✓ Signature captured'
                : 'Tap to sign'}
            </Text>
          </View>
        </View>
      </View>

      {/* Legal Declaration */}
      <View style={styles.declarationBox}>
        <Text style={styles.declarationTitle}>LEGAL DECLARATION</Text>
        <Text style={styles.declarationText}>
          I declare that the information provided in this chain of custody documentation is true
          and accurate to the best of my knowledge and belief. I understand that this documentation
          may be used as evidence in court proceedings and that providing false information is a
          criminal offense under Kenyan law.
        </Text>
        <Text style={[styles.declarationText, { marginTop: 12, fontStyle: 'italic' }]}>
          This chain of custody form must be submitted together with the specimens to the Government
          Chemist or authorized forensic laboratory within the stipulated timeframe.
        </Text>
      </View>

      {/* Footer Note */}
      <View style={styles.footerNote}>
        <Text style={styles.footerNoteText}>
          END OF PART TWO - MEDICAL PRACTITIONER SECTION{'\n'}
          Form P3 - Kenya Police Medical Examination Report
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#FF6F00', // Orange for chain of custody (legal importance)
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#E65100',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Legal Alert Box
  legalAlertBox: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6F00',
    margin: 16,
    borderRadius: 8,
  },
  legalAlertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  legalAlertContent: {
    flex: 1,
  },
  legalAlertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  legalAlertText: {
    fontSize: 13,
    color: '#5D4037',
    lineHeight: 18,
  },

  // Instructions Box
  instructionsBox: {
    padding: 16,
    backgroundColor: '#FFF9C4',
    borderLeftWidth: 4,
    borderLeftColor: '#FBC02D',
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 13,
    color: '#5D4037',
    lineHeight: 20,
  },

  // Section Styling
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionHeader: {
    padding: 12,
    backgroundColor: '#FF6F00',
    borderBottomWidth: 2,
    borderBottomColor: '#E65100',
  },
  practitionerHeader: {
    backgroundColor: '#2E7D32', // Green for medical
  },
  policeHeader: {
    backgroundColor: '#1565C0', // Blue for police
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // Table Styling
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#424242',
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#212121',
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  tableCell: {
    padding: 4,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  serialNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#424242',
    textAlign: 'center',
  },

  // Add Row Button
  addRowButton: {
    padding: 12,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#1976D2',
  },
  addRowButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
  },

  // Signature Grid
  signatureGrid: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  signatureColumn: {
    flex: 1,
  },

  // Signature Box
  signatureBox: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  signatureLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  signatureLine: {
    height: 60,
    borderWidth: 2,
    borderColor: '#1976D2',
    borderStyle: 'dashed',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  signaturePlaceholder: {
    fontSize: 13,
    color: '#757575',
    fontStyle: 'italic',
  },

  // Stamp Box
  stampBox: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  stampLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 8,
    textAlign: 'center',
  },
  stampArea: {
    height: 80,
    borderWidth: 2,
    borderColor: '#D32F2F',
    borderStyle: 'dashed',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  stampPlaceholder: {
    fontSize: 12,
    color: '#757575',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Declaration Box
  declarationBox: {
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
    margin: 16,
    borderRadius: 8,
  },
  declarationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 8,
  },
  declarationText: {
    fontSize: 13,
    color: '#5D4037',
    lineHeight: 20,
  },

  // Footer Note
  footerNote: {
    padding: 20,
    backgroundColor: '#ECEFF1',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#90A4AE',
    marginTop: 8,
  },
  footerNoteText: {
    fontSize: 12,
    color: '#455A64',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 18,
  },
});

export default P3ChainOfCustodyComponent;
