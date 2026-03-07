import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  MapPin,
  Mic,
  Play,
  Pause,
  Square,
  Trash2,
  Shield,
} from 'lucide-react-native';
import { useIncidents } from '@/providers/IncidentProvider';
import { useToast } from '@/providers/ToastProvider';

const incidentTypes = [
  { id: 'physical', title: 'Physical Violence', color: '#E53935' },
  { id: 'sexual', title: 'Sexual Violence', color: '#C2185B' },
  { id: 'emotional', title: 'Emotional/Psychological Abuse', color: '#4527A0' },
  { id: 'economic', title: 'Economic Abuse', color: '#FF8F00' },
  { id: 'online', title: 'Online Gender-Based Violence', color: '#1565C0' },
  { id: 'femicide', title: 'Femicide/Attempted Femicide', color: '#B71C1C' },
];

const supportServices = [
  { id: 'medical', title: 'Medical Assistance', icon: '🏥', urgent: true, providerType: 'healthcare' },
  { id: 'legal', title: 'Legal Support', icon: '⚖️', urgent: false, providerType: 'legal' },
  { id: 'counseling', title: 'Psychological Counseling', icon: '🧠', urgent: false, providerType: 'counseling' },
  { id: 'police', title: 'Police Intervention', icon: '👮', urgent: true, providerType: 'police' },
  { id: 'shelter', title: 'Shelter/Accommodation', icon: '🏠', urgent: false, providerType: 'social' },
  { id: 'financial', title: 'Financial Assistance', icon: '💰', urgent: false, providerType: 'social' },
  { id: 'emergency', title: 'Emergency Response', icon: '🚨', urgent: true, providerType: 'gbv_rescue' },
];

export default function ReportScreen() {
  const { createIncident, isCreating, createError } = useIncidents();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reportData, setReportData] = useState({
    type: '',
    incidentDate: '',
    incidentTime: '',
    location: {
      address: '',
      coordinates: undefined as { latitude: number; longitude: number } | undefined,
      description: '',
    },
    description: '',
    severity: 'medium', // Default severity
    supportServices: [] as string[],
    urgencyLevel: 'routine' as 'immediate' | 'urgent' | 'routine',
    providerPreferences: {
      communicationMethod: 'sms' as 'sms' | 'call' | 'secure_message',
      preferredGender: 'no_preference' as 'male' | 'female' | 'no_preference',
      proximityPreference: 'nearest' as 'nearest' | 'specific_facility',
    },
    isAnonymous: false,
    voiceRecording: undefined as {
      uri: string;
      duration: number;
      transcription?: string;
    } | undefined,
  });

  // Voice recording state
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);

  useEffect(() => {
    requestAudioPermissions();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  const requestAudioPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setHasAudioPermission(status === 'granted');

      if (status !== 'granted') {
        toast.showError(
          'Permission Required',
          'Audio recording permission is needed to use voice reporting feature. Please enable it in your device settings.',
          5000
        );
      }
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting audio permissions:', error);
      toast.showError('Permission Error', 'Failed to request audio permissions. Please try again.');
      return false;
    }
  };

  const totalSteps = 5;

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        // Incident type is required
        if (!reportData.type) {
          return { isValid: false, message: 'Please select an incident type to continue.' };
        }
        return { isValid: true, message: '' };

      case 2:
        // Only date and description are required (time and location are optional)
        if (!reportData.incidentDate) {
          return { isValid: false, message: 'Please select the incident date.' };
        }
        if (!reportData.description && !reportData.voiceRecording) {
          return { isValid: false, message: 'Please provide a description or voice recording of the incident.' };
        }
        return { isValid: true, message: '' };

      case 3:
        // Support services are required
        if (reportData.supportServices.length === 0) {
          return { isValid: false, message: 'Please select at least one support service.' };
        }
        return { isValid: true, message: '' };

      case 4:
        // Communication preferences - no strict validation needed (defaults are set)
        return { isValid: true, message: '' };

      case 5:
        // Review step - final validation (time and location are optional)
        if (!reportData.type || !reportData.incidentDate) {
          return { isValid: false, message: 'Missing required information. Please review all steps.' };
        }
        if (!reportData.description && !reportData.voiceRecording) {
          return { isValid: false, message: 'Description is required.' };
        }
        if (reportData.supportServices.length === 0) {
          return { isValid: false, message: 'At least one support service is required.' };
        }
        return { isValid: true, message: '' };

      default:
        return { isValid: true, message: '' };
    }
  };

  const handleNext = () => {
    // Validate current step before proceeding
    const validation = validateCurrentStep();
    if (!validation.isValid) {
      toast.showError('Required Field', validation.message);
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (createError) {
      toast.showError('Submission Error', createError);
      return;
    }

    let finalDescription = reportData.description;
    
    // If there's a voice recording, include transcription in description
    if (reportData.voiceRecording?.transcription) {
      finalDescription = reportData.description 
        ? `${reportData.description}\n\n[Voice Recording Transcription]\n${reportData.voiceRecording.transcription}`
        : `[Voice Recording Transcription]\n${reportData.voiceRecording.transcription}`;
    }

    try {
      console.log('Attempting to submit incident...', reportData);

      await createIncident({
        type: reportData.type,
        incidentDate: reportData.incidentDate,
        incidentTime: reportData.incidentTime,
        location: reportData.location.address || reportData.location.description ? reportData.location : undefined,
        description: finalDescription,
        severity: reportData.severity,
        supportServices: reportData.supportServices,
        urgencyLevel: reportData.urgencyLevel,
        providerPreferences: reportData.providerPreferences,
        isAnonymous: reportData.isAnonymous,
      });

      console.log('Incident submitted successfully');

      // Show success toast
      toast.showSuccess(
        'Report Submitted',
        'Your report has been submitted successfully. You will receive updates on the progress of your case.',
        7000
      );

      // Navigate back after a short delay to allow toast to be seen
      setTimeout(() => {
        router.replace('/(dashboard)/survivor/reports');
      }, 1500);
    } catch (error: any) {
      console.error('Error submitting incident:', error);

      // Extract user-friendly error message
      const errorMessage = error?.message || 'An unexpected error occurred. Please try again.';

      toast.showError(
        'Failed to Submit Report',
        errorMessage,
        10000 // Show error for 10 seconds
      );
    }
  };

  const updateReportData = (key: string, value: any) => {
    setReportData(prev => ({ ...prev, [key]: value }));
  };

  // Update support services without auto-determining urgency
  // Survivors now manually select urgency level in Step 4
  const updateSupportServices = (services: string[]) => {
    setReportData(prev => ({
      ...prev,
      supportServices: services,
    }));
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        toast.showError('Permission Denied', 'Location permission is required to get your current location. Please enable it in settings.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const formattedAddress = address[0]
        ? `${address[0].street || ''} ${address[0].city || ''}, ${address[0].region || ''} ${address[0].postalCode || ''}`.trim()
        : `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;

      updateReportData('location', {
        address: formattedAddress,
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        description: reportData.location.description,
      });

      toast.showSuccess('Location Updated', 'Your current location has been added');
    } catch (error) {
      console.error('Error getting location:', error);
      toast.showError('Location Error', 'Unable to get your current location. Please enter it manually.');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateReportData('incidentDate', selectedDate.toISOString().split('T')[0]);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      updateReportData('incidentTime', selectedTime.toTimeString().split(' ')[0]);
    }
  };

  const toggleSupportService = (serviceId: string) => {
    const services = reportData.supportServices.includes(serviceId)
      ? reportData.supportServices.filter(id => id !== serviceId)
      : [...reportData.supportServices, serviceId];

    updateSupportServices(services);
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      if (!hasAudioPermission) {
        const result = await requestAudioPermissions();
        if (!result) {
          return;
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Update duration every second
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Store interval reference for cleanup
      (newRecording as any).durationInterval = interval;

      toast.showSuccess('Recording Started', 'Your voice recording has started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.showError('Recording Error', 'Failed to start recording. Please check your microphone and try again.');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      // Clear duration interval
      if ((recording as any).durationInterval) {
        clearInterval((recording as any).durationInterval);
      }

      setIsRecording(false);
      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      if (uri) {
        updateReportData('voiceRecording', {
          uri,
          duration: recordingDuration,
        });

        toast.showSuccess('Recording Saved', 'Your voice recording has been saved successfully');

        // Auto-transcribe the recording
        await transcribeRecording(uri);
      }

      setRecording(null);

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    } catch (error) {
      console.error('Failed to stop recording:', error);
      toast.showError('Error', 'Failed to stop recording. Please try again.');
    }
  };

  const playRecording = async () => {
    try {
      if (!reportData.voiceRecording?.uri) return;

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: reportData.voiceRecording.uri },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPlaybackPosition(status.positionMillis || 0);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPlaybackPosition(0);
          }
        }
      });
    } catch (error) {
      console.error('Failed to play recording:', error);
      toast.showError('Playback Error', 'Failed to play recording. Please try again.');
    }
  };

  const pauseRecording = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Failed to pause recording:', error);
    }
  };

  const deleteRecording = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      setIsPlaying(false);
      setPlaybackPosition(0);
      updateReportData('voiceRecording', undefined);
      toast.showSuccess('Recording Deleted', 'Your voice recording has been deleted');
    } catch (error) {
      console.error('Failed to delete recording:', error);
      toast.showError('Delete Error', 'Failed to delete recording. Please try again.');
    }
  };

  const transcribeRecording = async (uri: string) => {
    if (Platform.OS === 'web') {
      // Web transcription not implemented in this demo
      return;
    }

    try {
      setIsTranscribing(true);
      
      const formData = new FormData();
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      const audioFile = {
        uri,
        name: `recording.${fileType}`,
        type: `audio/${fileType}`,
      } as any;
      
      formData.append('audio', audioFile);
      
      const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        updateReportData('voiceRecording', {
          ...reportData.voiceRecording!,
          transcription: result.text,
        });
      }
    } catch (error) {
      console.error('Transcription failed:', error);
      // Silently fail transcription - recording is still saved
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What type of incident occurred?</Text>
            <Text style={styles.stepDescription}>
              Please select the category that best describes the incident
            </Text>
            <View style={styles.incidentTypes}>
              {incidentTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.incidentType,
                    reportData.type === type.id && styles.incidentTypeSelected,
                  ]}
                  onPress={() => updateReportData('type', type.id)}
                  testID={`incident-type-${type.id}`}
                >
                  <View
                    style={[
                      styles.incidentTypeIndicator,
                      { backgroundColor: type.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.incidentTypeText,
                      reportData.type === type.id && styles.incidentTypeTextSelected,
                    ]}
                  >
                    {type.title}
                  </Text>
                  {reportData.type === type.id && (
                    <Check color="#6A2CB0" size={20} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>When and where did this happen?</Text>
            <Text style={styles.stepDescription}>
              Provide details about the time and location
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar color="#6A2CB0" size={20} />
                <Text style={styles.dateInputText}>
                  {reportData.incidentDate 
                    ? new Date(reportData.incidentDate).toLocaleDateString()
                    : 'Select date'
                  }
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={reportData.incidentDate ? new Date(reportData.incidentDate) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time (Optional)</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowTimePicker(true)}
              >
                <Calendar color="#6A2CB0" size={20} />
                <Text style={styles.dateInputText}>
                  {reportData.incidentTime || 'Select time'}
                </Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={reportData.incidentTime ? new Date(`2000-01-01T${reportData.incidentTime}`) : new Date()}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onTimeChange}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location (Optional)</Text>
              <View style={styles.locationContainer}>
                <TouchableOpacity 
                  style={styles.locationInput}
                  onPress={getCurrentLocation}
                >
                  <MapPin color="#6A2CB0" size={20} />
                  <Text style={styles.locationInputText}>
                    {reportData.location.address || 'Use current location'}
                  </Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.locationDescriptionInput}
                  value={reportData.location.description}
                  onChangeText={(value) => updateReportData('location', {
                    ...reportData.location,
                    description: value,
                  })}
                  placeholder="Or describe the location"
                  placeholderTextColor="#D8CEE8"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.descriptionHeader}>
                <Text style={styles.inputLabel}>Description (Text or Voice Recording)</Text>
                <TouchableOpacity
                  style={styles.voiceButton}
                  onPress={() => setShowVoiceRecorder(!showVoiceRecorder)}
                  testID="voice-recorder-toggle"
                >
                  <Mic color="#6A2CB0" size={16} />
                  <Text style={styles.voiceButtonText}>Voice</Text>
                </TouchableOpacity>
              </View>
              
              {showVoiceRecorder && (
                <View style={styles.voiceRecorderContainer}>
                  {!reportData.voiceRecording ? (
                    <View style={styles.recordingControls}>
                      <TouchableOpacity
                        style={[
                          styles.recordButton,
                          isRecording && styles.recordButtonActive,
                        ]}
                        onPress={isRecording ? stopRecording : startRecording}
                        disabled={!hasAudioPermission}
                      >
                        {isRecording ? (
                          <Square color="#FFFFFF" size={24} />
                        ) : (
                          <Mic color="#FFFFFF" size={24} />
                        )}
                      </TouchableOpacity>
                      
                      <View style={styles.recordingInfo}>
                        <Text style={styles.recordingStatus}>
                          {isRecording ? 'Recording...' : 'Tap to record'}
                        </Text>
                        {isRecording && (
                          <Text style={styles.recordingDuration}>
                            {formatDuration(recordingDuration)}
                          </Text>
                        )}
                      </View>
                    </View>
                  ) : (
                    <View style={styles.recordingPlayback}>
                      <View style={styles.playbackControls}>
                        <TouchableOpacity
                          style={styles.playButton}
                          onPress={isPlaying ? pauseRecording : playRecording}
                        >
                          {isPlaying ? (
                            <Pause color="#6A2CB0" size={20} />
                          ) : (
                            <Play color="#6A2CB0" size={20} />
                          )}
                        </TouchableOpacity>
                        
                        <View style={styles.playbackInfo}>
                          <Text style={styles.playbackDuration}>
                            {formatDuration(Math.floor(playbackPosition / 1000))} / {formatDuration(reportData.voiceRecording.duration)}
                          </Text>
                          <View style={styles.progressBar}>
                            <View 
                              style={[
                                styles.progressFill,
                                { 
                                  width: `${(playbackPosition / (reportData.voiceRecording.duration * 1000)) * 100}%` 
                                }
                              ]} 
                            />
                          </View>
                        </View>
                        
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={deleteRecording}
                        >
                          <Trash2 color="#E53935" size={16} />
                        </TouchableOpacity>
                      </View>
                      
                      {isTranscribing && (
                        <View style={styles.transcriptionStatus}>
                          <Text style={styles.transcriptionText}>Transcribing audio...</Text>
                        </View>
                      )}
                      
                      {reportData.voiceRecording.transcription && (
                        <View style={styles.transcriptionResult}>
                          <Text style={styles.transcriptionLabel}>Transcription:</Text>
                          <Text style={styles.transcriptionContent}>
                            {reportData.voiceRecording.transcription}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                  
                  <View style={styles.voiceRecorderNote}>
                    <Shield color="#43A047" size={14} />
                    <Text style={styles.voiceRecorderNoteText}>
                      Voice recordings are encrypted and secure. Transcription helps our team understand your report better.
                    </Text>
                  </View>
                </View>
              )}
              
              <TextInput
                style={styles.textArea}
                value={reportData.description}
                onChangeText={(value) => updateReportData('description', value)}
                placeholder={reportData.voiceRecording ? "Add additional details (optional)" : "Describe what happened (required, or use voice recording)"}
                placeholderTextColor="#D8CEE8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What support do you need?</Text>
            <Text style={styles.stepDescription}>
              Select at least one service you would like to access
            </Text>
            <View style={styles.supportServices}>
              {supportServices.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.supportService,
                    reportData.supportServices.includes(service.id) && styles.supportServiceSelected,
                  ]}
                  onPress={() => toggleSupportService(service.id)}
                  testID={`support-service-${service.id}`}
                >
                  <Text style={styles.supportServiceIcon}>{service.icon}</Text>
                  <Text
                    style={[
                      styles.supportServiceText,
                      reportData.supportServices.includes(service.id) && styles.supportServiceTextSelected,
                    ]}
                  >
                    {service.title}
                  </Text>
                  {reportData.supportServices.includes(service.id) && (
                    <Check color="#FFFFFF" size={20} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>How should providers contact you?</Text>
            <Text style={styles.stepDescription}>
              Set your communication preferences and urgency level
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Urgency Level</Text>
              <Text style={styles.inputHelper}>
                Select the urgency level for dispatcher review
              </Text>
              <View style={styles.urgencyOptions}>
                {[
                  {
                    id: 'immediate',
                    title: 'Immediate',
                    description: 'Life-threatening situation requiring immediate response',
                    color: '#E53935'
                  },
                  {
                    id: 'urgent',
                    title: 'Urgent',
                    description: 'Serious situation requiring priority attention',
                    color: '#FF8F00'
                  },
                  {
                    id: 'routine',
                    title: 'Routine',
                    description: 'Standard case requiring normal processing',
                    color: '#43A047'
                  }
                ].map((urgency) => (
                  <TouchableOpacity
                    key={urgency.id}
                    style={[
                      styles.urgencyOption,
                      reportData.urgencyLevel === urgency.id && styles.urgencyOptionSelected,
                    ]}
                    onPress={() => updateReportData('urgencyLevel', urgency.id)}
                  >
                    <View style={[styles.urgencyIndicator, { backgroundColor: urgency.color }]} />
                    <View style={styles.urgencyContent}>
                      <Text style={[
                        styles.urgencyTitle,
                        reportData.urgencyLevel === urgency.id && styles.urgencyTitleSelected,
                      ]}>
                        {urgency.title}
                      </Text>
                      <Text style={styles.urgencyDescription}>
                        {urgency.description}
                      </Text>
                    </View>
                    {reportData.urgencyLevel === urgency.id && (
                      <Check color="#6A2CB0" size={20} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Preferred Communication Method</Text>
              <View style={styles.communicationOptions}>
                {[
                  { id: 'sms', title: 'Text Message (SMS)', description: 'Quick and discrete' },
                  { id: 'call', title: 'Phone Call', description: 'Direct conversation' },
                  { id: 'secure_message', title: 'Secure App Message', description: 'Encrypted messaging' }
                ].map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.communicationOption,
                      reportData.providerPreferences.communicationMethod === method.id && styles.communicationOptionSelected,
                    ]}
                    onPress={() => updateReportData('providerPreferences', {
                      ...reportData.providerPreferences,
                      communicationMethod: method.id
                    })}
                  >
                    <View style={styles.communicationOptionContent}>
                      <Text style={[
                        styles.communicationOptionTitle,
                        reportData.providerPreferences.communicationMethod === method.id && styles.communicationOptionTitleSelected,
                      ]}>
                        {method.title}
                      </Text>
                      <Text style={styles.communicationOptionDescription}>
                        {method.description}
                      </Text>
                    </View>
                    {reportData.providerPreferences.communicationMethod === method.id && (
                      <Check color="#6A2CB0" size={20} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review & Submit</Text>
            <Text style={styles.stepDescription}>
              Review your report before submitting
            </Text>
            
            <View style={styles.reviewCard}>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Incident Type:</Text>
                <Text style={styles.reviewValue}>
                  {incidentTypes.find(t => t.id === reportData.type)?.title || 'Not specified'}
                </Text>
              </View>
              
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Support Services:</Text>
                <Text style={styles.reviewValue}>
                  {reportData.supportServices.length > 0 
                    ? `${reportData.supportServices.length} services selected`
                    : 'None selected'
                  }
                </Text>
              </View>

              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Privacy:</Text>
                <Text style={styles.reviewValue}>
                  {reportData.isAnonymous ? 'Anonymous' : 'Identified'}
                </Text>
              </View>

              {reportData.voiceRecording && (
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Voice Recording:</Text>
                  <Text style={styles.reviewValue}>
                    {formatDuration(reportData.voiceRecording.duration)} audio recording included
                    {reportData.voiceRecording.transcription && ' (transcribed)'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.privacyOptions}>
              <TouchableOpacity
                style={styles.privacyOption}
                onPress={() => updateReportData('isAnonymous', !reportData.isAnonymous)}
              >
                <View
                  style={[
                    styles.checkbox,
                    reportData.isAnonymous && styles.checkboxActive,
                  ]}
                >
                  {reportData.isAnonymous && <Check color="#FFFFFF" size={16} />}
                </View>
                <Text style={styles.privacyOptionText}>
                  Submit this report anonymously
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.securityNote}>
              <Shield color="#43A047" size={20} />
              <Text style={styles.securityNoteText}>
                Your report is encrypted and secure. Only authorized personnel will have access.
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        // Incident type is required
        return reportData.type !== '';
      case 2:
        // Only date and description are required (time and location are optional)
        return reportData.incidentDate !== '' &&
               (reportData.description !== '' || reportData.voiceRecording !== undefined);
      case 3:
        // At least one support service is required
        return reportData.supportServices.length > 0;
      case 4:
        // Communication preferences - always allow proceed (defaults are set)
        return true;
      case 5:
        // Review step - all required fields must be filled
        return reportData.type !== '' &&
               reportData.incidentDate !== '' &&
               (reportData.description !== '' || reportData.voiceRecording !== undefined) &&
               reportData.supportServices.length > 0;
      default:
        return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          testID="back-button"
        >
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Incident</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarHeader}>
          <LinearGradient
            colors={['#6A2CB0', '#E24B95']}
            style={[
              styles.progressFillHeader,
              { width: `${(currentStep / totalSteps) * 100}%` },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {renderStepContent()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            (!canProceed() || isCreating) && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canProceed() || isCreating}
          testID="next-button"
        >
          <Text style={styles.nextButtonText}>
            {isCreating 
              ? 'Submitting...' 
              : currentStep === totalSteps 
                ? 'Submit Report' 
                : 'Continue'
            }
          </Text>
          {!isCreating && <ArrowRight color="#FFFFFF" size={20} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  progressContainer: {
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  progressBarHeader: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFillHeader: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  stepContent: {
    padding: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#49455A',
    lineHeight: 22,
    marginBottom: 32,
  },
  incidentTypes: {
    gap: 12,
  },
  incidentType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  incidentTypeSelected: {
    borderColor: '#6A2CB0',
    backgroundColor: '#F5F0FF',
  },
  incidentTypeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  incidentTypeText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
  },
  incidentTypeTextSelected: {
    color: '#6A2CB0',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D8CEE8',
    gap: 12,
  },
  dateInputText: {
    flex: 1,
    fontSize: 16,
    color: '#341A52',
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D8CEE8',
    gap: 12,
  },
  locationInputText: {
    flex: 1,
    fontSize: 16,
    color: '#341A52',
  },
  locationContainer: {
    gap: 12,
  },
  locationDescriptionInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#341A52',
    borderWidth: 1,
    borderColor: '#D8CEE8',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#341A52',
    borderWidth: 1,
    borderColor: '#D8CEE8',
    minHeight: 120,
  },
  supportServices: {
    gap: 12,
  },
  supportService: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  supportServiceSelected: {
    backgroundColor: '#6A2CB0',
    borderColor: '#6A2CB0',
  },
  supportServiceIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  supportServiceText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
  },
  supportServiceTextSelected: {
    color: '#FFFFFF',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#49455A',
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 16,
    color: '#341A52',
  },
  privacyOptions: {
    marginBottom: 24,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#6A2CB0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#6A2CB0',
  },
  privacyOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#341A52',
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  securityNoteText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 18,
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F5F0FF',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6A2CB0',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  // Voice recording styles
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  voiceButtonText: {
    color: '#6A2CB0',
    fontSize: 12,
    fontWeight: '600',
  },
  voiceRecorderContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D8CEE8',
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  recordButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6A2CB0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#E53935',
  },
  recordingInfo: {
    flex: 1,
  },
  recordingStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 4,
  },
  recordingDuration: {
    fontSize: 14,
    color: '#6A2CB0',
    fontWeight: '600',
  },
  recordingPlayback: {
    gap: 12,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6A2CB0',
  },
  playbackInfo: {
    flex: 1,
  },
  playbackDuration: {
    fontSize: 14,
    color: '#341A52',
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#D8CEE8',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6A2CB0',
    borderRadius: 2,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },
  transcriptionStatus: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  transcriptionText: {
    fontSize: 14,
    color: '#6A2CB0',
    fontStyle: 'italic',
  },
  transcriptionResult: {
    backgroundColor: '#F5F0FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  transcriptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A2CB0',
    marginBottom: 4,
  },
  transcriptionContent: {
    fontSize: 14,
    color: '#341A52',
    lineHeight: 18,
  },
  voiceRecorderNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  voiceRecorderNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#2E7D32',
    lineHeight: 16,
  },
  urgencyContainer: {
    alignItems: 'flex-start',
    gap: 8,
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  urgencyNote: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  inputHelper: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  urgencyOptions: {
    gap: 12,
  },
  urgencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  urgencyOptionSelected: {
    borderColor: '#6A2CB0',
    backgroundColor: '#F5F0FF',
  },
  urgencyIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  urgencyContent: {
    flex: 1,
  },
  urgencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 4,
  },
  urgencyTitleSelected: {
    color: '#6A2CB0',
  },
  urgencyDescription: {
    fontSize: 14,
    color: '#666666',
  },
  communicationOptions: {
    gap: 12,
  },
  communicationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  communicationOptionSelected: {
    borderColor: '#6A2CB0',
    backgroundColor: '#F5F0FF',
  },
  communicationOptionContent: {
    flex: 1,
  },
  communicationOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 4,
  },
  communicationOptionTitleSelected: {
    color: '#6A2CB0',
  },
  communicationOptionDescription: {
    fontSize: 14,
    color: '#666666',
  },
});