import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import {
  Heart,
  Shield,
  Users,
  BookOpen,
  Phone,
  MapPin,
  FileText,
  Activity,
  MessageSquare,
  Calendar,
  Star,
  ExternalLink,
} from 'lucide-react-native';

export function SupportServices() {
  const services = [
    {
      id: 'counseling',
      title: 'Counseling Services',
      description: 'Professional mental health support and therapy sessions',
      icon: Heart,
      color: '#8B5CF6',
      available: 5,
      rating: 4.8,
      features: ['Individual Therapy', 'Group Sessions', 'Crisis Support', '24/7 Hotline'],
    },
    {
      id: 'legal',
      title: 'Legal Aid',
      description: 'Free legal consultation and representation services',
      icon: FileText,
      color: '#3B82F6',
      available: 3,
      rating: 4.9,
      features: ['Legal Consultation', 'Court Representation', 'Document Preparation', 'Rights Education'],
    },
    {
      id: 'medical',
      title: 'Medical Care',
      description: 'Comprehensive healthcare and medical support',
      icon: Activity,
      color: '#10B981',
      available: 4,
      rating: 4.7,
      features: ['Emergency Care', 'Regular Checkups', 'Mental Health', 'Specialist Referrals'],
    },
    {
      id: 'shelter',
      title: 'Safe Housing',
      description: 'Emergency shelter and transitional housing options',
      icon: MapPin,
      color: '#F59E0B',
      available: 2,
      rating: 4.6,
      features: ['Emergency Shelter', 'Transitional Housing', 'Safety Planning', 'Location Services'],
    },
    {
      id: 'support_groups',
      title: 'Support Groups',
      description: 'Peer support and community healing circles',
      icon: Users,
      color: '#EC4899',
      available: 8,
      rating: 4.9,
      features: ['Peer Support', 'Group Therapy', 'Survivor Networks', 'Community Events'],
    },
    {
      id: 'education',
      title: 'Educational Resources',
      description: 'Learning materials and skill development programs',
      icon: BookOpen,
      color: '#6366F1',
      available: 12,
      rating: 4.5,
      features: ['Self-Help Guides', 'Skill Training', 'Online Courses', 'Workshops'],
    },
  ];

  const emergencyContacts = [
    {
      id: 'police',
      title: 'Emergency Police',
      number: '911',
      description: 'Immediate police response',
      color: '#E53935',
    },
    {
      id: 'crisis',
      title: 'Crisis Hotline',
      number: '1-800-799-7233',
      description: '24/7 crisis support',
      color: '#8B5CF6',
    },
    {
      id: 'medical',
      title: 'Medical Emergency',
      number: '911',
      description: 'Emergency medical services',
      color: '#10B981',
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        color={i < Math.floor(rating) ? '#F59E0B' : '#D1D5DB'}
        fill={i < Math.floor(rating) ? '#F59E0B' : 'transparent'}
      />
    ));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Support Services</Text>
        <Text style={styles.subtitle}>Access professional help and community support</Text>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <View style={styles.emergencyGrid}>
          {emergencyContacts.map((contact) => (
            <TouchableOpacity key={contact.id} style={styles.emergencyCard}>
              <View style={[styles.emergencyIcon, { backgroundColor: contact.color }]}>
                <Phone color="#FFFFFF" size={20} />
              </View>
              <Text style={styles.emergencyTitle}>{contact.title}</Text>
              <Text style={styles.emergencyNumber}>{contact.number}</Text>
              <Text style={styles.emergencyDescription}>{contact.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Available Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Services</Text>
        <View style={styles.servicesList}>
          {services.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                  <service.icon color="#FFFFFF" size={24} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <View style={styles.serviceRating}>
                    <View style={styles.stars}>
                      {renderStars(service.rating)}
                    </View>
                    <Text style={styles.ratingText}>{service.rating}</Text>
                  </View>
                </View>
                <View style={styles.availabilityBadge}>
                  <Text style={styles.availabilityText}>{service.available} available</Text>
                </View>
              </View>
              
              <Text style={styles.serviceDescription}>{service.description}</Text>
              
              <View style={styles.featuresContainer}>
                {service.features.map((feature, index) => (
                  <View key={index} style={styles.featureTag}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.serviceActions}>
                <TouchableOpacity style={styles.requestButton}>
                  <MessageSquare color="#FFFFFF" size={16} />
                  <Text style={styles.requestButtonText}>Request Service</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.learnMoreButton}>
                  <ExternalLink color="#6A2CB0" size={16} />
                  <Text style={styles.learnMoreText}>Learn More</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/report')}
          >
            <FileText color="#E24B95" size={24} />
            <Text style={styles.quickActionTitle}>Report Incident</Text>
            <Text style={styles.quickActionDescription}>File a new report or incident</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/safety')}
          >
            <Shield color="#26A69A" size={24} />
            <Text style={styles.quickActionTitle}>Safety Planning</Text>
            <Text style={styles.quickActionDescription}>Create your safety plan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <Calendar color="#8B5CF6" size={24} />
            <Text style={styles.quickActionTitle}>Schedule Appointment</Text>
            <Text style={styles.quickActionDescription}>Book a consultation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <Users color="#F59E0B" size={24} />
            <Text style={styles.quickActionTitle}>Join Support Group</Text>
            <Text style={styles.quickActionDescription}>Connect with others</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
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
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  emergencyGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  emergencyCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#341A52',
    textAlign: 'center',
    marginBottom: 4,
  },
  emergencyNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E53935',
    marginBottom: 4,
  },
  emergencyDescription: {
    fontSize: 10,
    color: '#49455A',
    textAlign: 'center',
  },
  servicesList: {
    paddingHorizontal: 24,
    gap: 20,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 4,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#49455A',
  },
  availabilityBadge: {
    backgroundColor: '#F5F0FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
    marginBottom: 16,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  featureTag: {
    backgroundColor: '#F5F0FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featureText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6A2CB0',
  },
  serviceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  requestButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6A2CB0',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F0FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  learnMoreText: {
    color: '#6A2CB0',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#49455A',
    textAlign: 'center',
  },
});