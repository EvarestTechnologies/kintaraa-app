/**
 * Communication Actions Component
 * Provides SMS and Call buttons for contacting survivors/providers
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Phone, MessageSquare } from 'lucide-react-native';
import { CommunicationService } from '@/services/communicationService';

interface CommunicationActionsProps {
  caseId: string;
  recipientId: string;
  recipientPhone: string;
  recipientName: string;
  onSMSPress?: () => void;
  onCallPress?: () => void;
  variant?: 'row' | 'column';
  size?: 'small' | 'medium' | 'large';
}

export function CommunicationActions({
  caseId,
  recipientId,
  recipientPhone,
  recipientName,
  onSMSPress,
  onCallPress,
  variant = 'row',
  size = 'medium',
}: CommunicationActionsProps) {
  const handleCall = async () => {
    try {
      if (onCallPress) {
        onCallPress();
        return;
      }

      Alert.alert(
        'Call Survivor',
        `Are you sure you want to call ${recipientName}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Call',
            onPress: async () => {
              try {
                await CommunicationService.initiateCall({
                  caseId,
                  recipientId,
                  recipientPhone,
                });
              } catch (error) {
                console.error('Call failed:', error);
                Alert.alert(
                  'Call Failed',
                  'Unable to initiate call. Please check the phone number or try again later.'
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error handling call:', error);
    }
  };

  const handleSMS = () => {
    if (onSMSPress) {
      onSMSPress();
    }
  };

  const buttonSize = size === 'small' ? 32 : size === 'medium' ? 40 : 48;
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;

  return (
    <View style={[styles.container, variant === 'column' && styles.columnLayout]}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.callButton,
          { width: buttonSize, height: buttonSize },
        ]}
        onPress={handleCall}
        activeOpacity={0.7}
      >
        <Phone color="#FFFFFF" size={iconSize} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.smsButton,
          { width: buttonSize, height: buttonSize },
          variant === 'column' && styles.columnSpacing,
        ]}
        onPress={handleSMS}
        activeOpacity={0.7}
      >
        <MessageSquare color="#FFFFFF" size={iconSize} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  columnLayout: {
    flexDirection: 'column',
  },
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callButton: {
    backgroundColor: '#10B981',
  },
  smsButton: {
    backgroundColor: '#6A2CB0',
  },
  columnSpacing: {
    marginTop: 8,
  },
});
