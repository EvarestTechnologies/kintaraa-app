import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {
  BookOpen,
  ExternalLink,
  Heart,
  Shield,
  Users,
  Phone,
  FileText,
  Video,
  Headphones,
  Download,
  Star,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import { ResourceViewer } from '@/dashboards/survivor/components/ResourceViewer';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'pdf' | 'website' | 'hotline';
  category: string;
  url?: string;
  phone?: string;
  duration?: string;
  rating?: number;
  featured?: boolean;
}

const resourceCategories = [
  { id: 'all', title: 'All Resources', icon: BookOpen },
  { id: 'safety', title: 'Safety Planning', icon: Shield },
  { id: 'healing', title: 'Healing & Recovery', icon: Heart },
  { id: 'legal', title: 'Legal Rights', icon: FileText },
  { id: 'support', title: 'Support Networks', icon: Users },
  { id: 'crisis', title: 'Crisis Support', icon: Phone },
];

const learningResources: Resource[] = [
  // Featured Resources - Self-contained
  {
    id: 'safety-plan-guide',
    title: 'Personal Safety Planning Guide',
    description: 'Step-by-step safety planning checklist and emergency contact template you can save on your phone.',
    type: 'pdf',
    category: 'safety',
    duration: '10 min read',
    rating: 4.9,
    featured: true,
  },
  {
    id: 'gbv-awareness-content',
    title: 'Understanding Gender-Based Violence',
    description: 'Educational content explaining types of GBV, warning signs, and cycle of violence patterns.',
    type: 'article',
    category: 'healing',
    duration: '8 min read',
    rating: 4.8,
    featured: true,
  },
  {
    id: 'emergency-contacts',
    title: 'Emergency Helplines',
    description: '24/7 confidential support numbers. Save these in your phone for quick access.',
    type: 'hotline',
    category: 'crisis',
    phone: '1195',
    featured: true,
  },

  // Legal Forms and Documents
  {
    id: 'p3-form',
    title: 'P3 Form (Kenya Police Medical Report)',
    description: 'Comprehensive guide to the official Kenya Police Medical Examination Report Form P3. Essential for documenting injuries in criminal cases.',
    type: 'pdf',
    category: 'legal',
    duration: 'Complete guide',
    rating: 4.9,
  },
  {
    id: 'prc-form',
    title: 'PRC Form (Post Rape Care - MOH 363)',
    description: 'Official Ministry of Health Post Rape Care form for documenting medical examination and care for sexual violence survivors.',
    type: 'pdf',
    category: 'legal',
    duration: 'Medical form guide',
    rating: 4.9,
  },
  {
    id: 'occurrence-book-form',
    title: 'OB Form Template',
    description: 'Template for reporting incidents at the police station. Know what information to prepare.',
    type: 'pdf',
    category: 'legal',
    duration: 'Form download',
    rating: 4.8,
  },
  {
    id: 'protection-order-application',
    title: 'Protection Order Application',
    description: 'Step-by-step guide and template for applying for a protection order.',
    type: 'pdf',
    category: 'legal',
    duration: 'Form download',
    rating: 4.7,
  },

  // Healing & Recovery Resources
  {
    id: 'trauma-recovery',
    title: 'Healing Journey Workbook',
    description: 'Self-guided exercises for healing from trauma and rebuilding confidence. Complete within the app.',
    type: 'article',
    category: 'healing',
    duration: '20 min read',
    rating: 4.9,
  },
  {
    id: 'mindfulness-guide',
    title: 'Mindfulness and Breathing Exercises',
    description: 'Simple breathing techniques and mindfulness practices you can do anywhere, anytime.',
    type: 'article',
    category: 'healing',
    duration: '10 min read',
    rating: 4.7,
  },
  {
    id: 'self-care-checklist',
    title: 'Daily Self-Care Checklist',
    description: 'Practical daily self-care activities for physical, emotional, and mental wellbeing.',
    type: 'pdf',
    category: 'healing',
    duration: 'Quick reference',
    rating: 4.8,
  },

  // Support Network Building
  {
    id: 'support-network-guide',
    title: 'Building Your Support Network',
    description: 'How to identify trusted people and build a strong support system for your safety and recovery.',
    type: 'article',
    category: 'support',
    duration: '12 min read',
    rating: 4.8,
  },
  {
    id: 'communication-guide',
    title: 'Talking to Family and Friends',
    description: 'Scripts and tips for discussing your situation with trusted family members and friends.',
    type: 'article',
    category: 'support',
    duration: '8 min read',
    rating: 4.7,
  },

  // Crisis Support Resources
  {
    id: 'police-reporting-guide',
    title: 'Reporting to Police',
    description: 'Step-by-step guide for reporting GBV incidents to police, including what to expect.',
    type: 'article',
    category: 'crisis',
    duration: '10 min read',
    rating: 4.9,
  },
  {
    id: 'emergency-contacts-list',
    title: 'Emergency Contact Numbers',
    description: 'Complete list of emergency numbers: Police (999), GBV Helpline (1195), Childline (116).',
    type: 'hotline',
    category: 'crisis',
    phone: '1195',
  },
];

export default function LearningResourcesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [showResourceViewer, setShowResourceViewer] = useState(false);

  const filteredResources = selectedCategory === 'all'
    ? learningResources
    : learningResources.filter(resource => resource.category === selectedCategory);

  const featuredResources = learningResources.filter(resource => resource.featured);

  const handleResourcePress = async (resource: Resource) => {
    if (resource.type === 'hotline' && resource.phone) {
      Alert.alert(
        'Call Support',
        `Would you like to call ${resource.title}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Call',
            onPress: () => Linking.openURL(`tel:${resource.phone}`),
          },
        ]
      );
    } else {
      // Open detailed resource content
      setSelectedResourceId(resource.id);
      setShowResourceViewer(true);
    }
  };

  const handleCloseResourceViewer = () => {
    setShowResourceViewer(false);
    setSelectedResourceId(null);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'pdf': return Download;
      case 'website': return ExternalLink;
      case 'hotline': return Phone;
      default: return FileText;
    }
  };

  const renderResourceCard = (resource: Resource) => {
    const ResourceIcon = getResourceIcon(resource.type);

    return (
      <TouchableOpacity
        key={resource.id}
        style={[styles.resourceCard, resource.featured && styles.featuredCard]}
        onPress={() => handleResourcePress(resource)}
      >
        <View style={styles.resourceHeader}>
          <View style={styles.resourceIconContainer}>
            <ResourceIcon color="#6A2CB0" size={20} />
          </View>
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle}>{resource.title}</Text>
            <View style={styles.resourceMeta}>
              {resource.duration && (
                <View style={styles.metaItem}>
                  <Clock color="#49455A" size={12} />
                  <Text style={styles.metaText}>{resource.duration}</Text>
                </View>
              )}
              {resource.rating && (
                <View style={styles.metaItem}>
                  <Star color="#F59E0B" size={12} />
                  <Text style={styles.metaText}>{resource.rating}</Text>
                </View>
              )}
            </View>
          </View>
          <ChevronRight color="#D8CEE8" size={20} />
        </View>
        <Text style={styles.resourceDescription}>{resource.description}</Text>
        {resource.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Learning Resources</Text>
        <Text style={styles.subtitle}>
          Educational materials, guides, and support resources for your journey
        </Text>
      </View>

      {/* Featured Resources */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Resources</Text>
        {featuredResources.map(renderResourceCard)}
      </View>

      {/* Category Filter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {resourceCategories.map((category) => {
            const CategoryIcon = category.icon;
            const isSelected = selectedCategory === category.id;

            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <CategoryIcon
                  color={isSelected ? '#FFFFFF' : '#6A2CB0'}
                  size={16}
                />
                <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                  {category.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Resources List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'all' ? 'All Resources' :
           resourceCategories.find(c => c.id === selectedCategory)?.title}
        </Text>
        {filteredResources.map(renderResourceCard)}
      </View>

      {/* Emergency Note */}
      <View style={styles.emergencyNote}>
        <View style={styles.emergencyHeader}>
          <Phone color="#E53935" size={20} />
          <Text style={styles.emergencyTitle}>Emergency Support</Text>
        </View>
        <Text style={styles.emergencyText}>
          If you're in immediate danger, call 999 (Police) or 911. For 24/7 GBV support, call 1195 (GBV Helpline) or 116 (Childline Kenya).
        </Text>
      </View>

      {/* Resource Viewer Modal */}
      {selectedResourceId && (
        <ResourceViewer
          visible={showResourceViewer}
          resourceId={selectedResourceId}
          onClose={handleCloseResourceViewer}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#49455A',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 16,
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#6A2CB0',
    gap: 6,
  },
  categoryChipSelected: {
    backgroundColor: '#6A2CB0',
    borderColor: '#6A2CB0',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#E24B95',
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resourceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 4,
  },
  resourceMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#49455A',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#E24B95',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emergencyNote: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E53935',
  },
  emergencyText: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
  },
});