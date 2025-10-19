/**
 * Quick Response Templates Component
 * Provides quick access to message templates for rapid communication
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { FileText, Send } from 'lucide-react-native';
import { CommunicationService, CommunicationTemplate } from '@/services/communicationService';
import { getDefaultTemplateVariables } from '@/app/utils/templateHelpers';

interface QuickResponseTemplatesProps {
  caseId: string;
  recipientId: string;
  recipientPhone: string;
  recipientName: string;
  category?: 'appointment' | 'follow_up' | 'emergency' | 'general';
  onTemplateSend?: (template: CommunicationTemplate, filledMessage: string) => void;
  variant?: 'grid' | 'list';
}

export function QuickResponseTemplates({
  caseId,
  recipientId,
  recipientPhone,
  recipientName,
  category,
  onTemplateSend,
  variant = 'grid',
}: QuickResponseTemplatesProps) {
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingTemplateId, setSendingTemplateId] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [category]);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const loadedTemplates = await CommunicationService.getTemplates(category);
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSend = async (template: CommunicationTemplate) => {
    try {
      setSendingTemplateId(template.id);

      // Fill template with default variables
      const variables = getDefaultTemplateVariables(recipientName, caseId);
      const filledMessage = CommunicationService.fillTemplate(template, variables);

      if (onTemplateSend) {
        onTemplateSend(template, filledMessage);
      } else {
        // Send immediately if no handler provided
        await CommunicationService.sendSMS({
          caseId,
          recipientId,
          recipientPhone,
          message: filledMessage,
          templateId: template.id,
        });
      }
    } catch (error) {
      console.error('Failed to send quick response:', error);
    } finally {
      setSendingTemplateId(null);
    }
  };

  const getCategoryColor = (cat: string): string => {
    switch (cat) {
      case 'appointment':
        return '#3B82F6';
      case 'follow_up':
        return '#10B981';
      case 'emergency':
        return '#EF4444';
      case 'general':
        return '#6A2CB0';
      default:
        return '#64748B';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#6A2CB0" />
        <Text style={styles.loadingText}>Loading templates...</Text>
      </View>
    );
  }

  if (templates.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FileText color="#CBD5E1" size={32} />
        <Text style={styles.emptyText}>No templates available</Text>
      </View>
    );
  }

  if (variant === 'grid') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      >
        {templates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={[
              styles.gridItem,
              { borderLeftColor: getCategoryColor(template.category) },
            ]}
            onPress={() => handleQuickSend(template)}
            disabled={sendingTemplateId === template.id}
          >
            <View style={styles.gridItemHeader}>
              <FileText color={getCategoryColor(template.category)} size={16} />
              <Text
                style={[
                  styles.categoryBadge,
                  { backgroundColor: `${getCategoryColor(template.category)}20` },
                ]}
              >
                {template.category.replace('_', ' ')}
              </Text>
            </View>

            <Text style={styles.gridItemTitle} numberOfLines={2}>
              {template.name}
            </Text>

            <Text style={styles.gridItemPreview} numberOfLines={3}>
              {template.content}
            </Text>

            {sendingTemplateId === template.id ? (
              <ActivityIndicator size="small" color="#6A2CB0" style={styles.sendingIndicator} />
            ) : (
              <View style={styles.sendIconContainer}>
                <Send color="#6A2CB0" size={14} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  // List variant
  return (
    <View style={styles.listContainer}>
      {templates.map((template) => (
        <TouchableOpacity
          key={template.id}
          style={styles.listItem}
          onPress={() => handleQuickSend(template)}
          disabled={sendingTemplateId === template.id}
        >
          <View style={styles.listItemIcon}>
            <FileText color={getCategoryColor(template.category)} size={20} />
          </View>

          <View style={styles.listItemContent}>
            <View style={styles.listItemHeader}>
              <Text style={styles.listItemTitle}>{template.name}</Text>
              <Text
                style={[
                  styles.categoryBadgeSmall,
                  {
                    backgroundColor: `${getCategoryColor(template.category)}20`,
                    color: getCategoryColor(template.category),
                  },
                ]}
              >
                {template.category.replace('_', ' ')}
              </Text>
            </View>
            <Text style={styles.listItemPreview} numberOfLines={2}>
              {template.content}
            </Text>
          </View>

          {sendingTemplateId === template.id ? (
            <ActivityIndicator size="small" color="#6A2CB0" />
          ) : (
            <Send color="#6A2CB0" size={16} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },
  gridContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  gridItem: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gridItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  gridItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
    lineHeight: 18,
  },
  gridItemPreview: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 8,
  },
  sendingIndicator: {
    alignSelf: 'flex-end',
  },
  sendIconContainer: {
    alignSelf: 'flex-end',
  },
  listContainer: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemContent: {
    flex: 1,
  },
  listItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  categoryBadgeSmall: {
    fontSize: 9,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  listItemPreview: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
});
