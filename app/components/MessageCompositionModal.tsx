/**
 * Message Composition Modal
 * Modal for composing and sending SMS messages with template support
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, Send, FileText } from 'lucide-react-native';
import { CommunicationService, CommunicationTemplate } from '@/services/communicationService';
import { getDefaultTemplateVariables } from '@/app/utils/templateHelpers';

interface MessageCompositionModalProps {
  visible: boolean;
  onClose: () => void;
  caseId: string;
  recipientId: string;
  recipientPhone: string;
  recipientName: string;
  onMessageSent?: () => void;
}

export function MessageCompositionModal({
  visible,
  onClose,
  caseId,
  recipientId,
  recipientPhone,
  recipientName,
  onMessageSent,
}: MessageCompositionModalProps) {
  const [message, setMessage] = useState('');
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  useEffect(() => {
    if (visible) {
      loadTemplates();
    }
  }, [visible]);

  const loadTemplates = async () => {
    try {
      setIsLoadingTemplates(true);
      const loadedTemplates = await CommunicationService.getTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleTemplateSelect = (template: CommunicationTemplate) => {
    setSelectedTemplate(template);

    // Fill template with default variables
    const variables = getDefaultTemplateVariables(recipientName, caseId);
    const filledMessage = CommunicationService.fillTemplate(template, variables);
    setMessage(filledMessage);
    setShowTemplates(false);
  };

  const handleSend = async () => {
    if (!message.trim()) {
      Alert.alert('Empty Message', 'Please enter a message to send.');
      return;
    }

    try {
      setIsSending(true);

      await CommunicationService.sendSMS({
        caseId,
        recipientId,
        recipientPhone,
        message: message.trim(),
        templateId: selectedTemplate?.id,
      });

      Alert.alert('Message Sent', 'Your message has been sent successfully.', [
        {
          text: 'OK',
          onPress: () => {
            setMessage('');
            setSelectedTemplate(null);
            onMessageSent?.();
            onClose();
          },
        },
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert(
        'Send Failed',
        'Unable to send message. Please try again later.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (message.trim() && !isSending) {
      Alert.alert(
        'Discard Message',
        'Are you sure you want to discard this message?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              setMessage('');
              setSelectedTemplate(null);
              onClose();
            },
          },
        ]
      );
    } else {
      setMessage('');
      setSelectedTemplate(null);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Send Message</Text>
            <TouchableOpacity onPress={handleClose} disabled={isSending}>
              <X color="#64748B" size={24} />
            </TouchableOpacity>
          </View>

          {/* Recipient Info */}
          <View style={styles.recipientInfo}>
            <Text style={styles.recipientLabel}>To:</Text>
            <Text style={styles.recipientName}>{recipientName}</Text>
            <Text style={styles.recipientPhone}>{recipientPhone}</Text>
          </View>

          {/* Template Selector */}
          <TouchableOpacity
            style={styles.templateButton}
            onPress={() => setShowTemplates(!showTemplates)}
            disabled={isLoadingTemplates}
          >
            <FileText color="#6A2CB0" size={20} />
            <Text style={styles.templateButtonText}>
              {selectedTemplate ? selectedTemplate.name : 'Use Template'}
            </Text>
          </TouchableOpacity>

          {/* Templates List */}
          {showTemplates && (
            <ScrollView style={styles.templatesList}>
              {isLoadingTemplates ? (
                <ActivityIndicator size="small" color="#6A2CB0" style={styles.loader} />
              ) : (
                templates.map((template) => (
                  <TouchableOpacity
                    key={template.id}
                    style={styles.templateItem}
                    onPress={() => handleTemplateSelect(template)}
                  >
                    <Text style={styles.templateName}>{template.name}</Text>
                    <Text style={styles.templateCategory}>{template.category}</Text>
                    <Text style={styles.templatePreview} numberOfLines={2}>
                      {template.content}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}

          {/* Message Input */}
          <TextInput
            style={styles.messageInput}
            multiline
            placeholder="Type your message here..."
            value={message}
            onChangeText={setMessage}
            editable={!isSending}
            maxLength={500}
            textAlignVertical="top"
          />

          {/* Character Count */}
          <Text style={styles.characterCount}>{message.length}/500</Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={isSending}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.sendButton,
                (!message.trim() || isSending) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!message.trim() || isSending}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Send color="#FFFFFF" size={20} />
                  <Text style={styles.sendButtonText}>Send</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  recipientInfo: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  recipientLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  recipientPhone: {
    fontSize: 14,
    color: '#64748B',
  },
  templateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  templateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  templatesList: {
    maxHeight: 200,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },
  loader: {
    padding: 20,
  },
  templateItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  templateCategory: {
    fontSize: 12,
    color: '#6A2CB0',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  templatePreview: {
    fontSize: 12,
    color: '#64748B',
  },
  messageInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1E293B',
    minHeight: 120,
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'right',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  sendButton: {
    backgroundColor: '#6A2CB0',
  },
  sendButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
