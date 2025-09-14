import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import {
  User,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  Edit,
  Eye,
  EyeOff,
  Fingerprint,
  ChevronRight,
  X,
  Phone,
  Mail,
  Lock,
  Globe,
  Heart,
  FileText,
  MessageCircle,
  Moon,
  Sun,
  Smartphone,
  Volume2,
  VolumeX,
  Languages,
  Palette,
  Download,
  Trash2,
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout, updateUser, biometricAvailable } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [privacySettings, setPrivacySettings] = useState({
    isAnonymous: user?.isAnonymous || false,
    shareLocation: false,
    allowMessages: true,
    publicProfile: false,
  });
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
    emergencyAlerts: true,
    caseUpdates: true,
    appointmentReminders: true,
  });
  const [appSettings, setAppSettings] = useState({
    theme: 'light' as 'light' | 'dark' | 'system',
    language: 'en' as 'en' | 'es' | 'fr' | 'sw',
    soundEnabled: true,
    hapticsEnabled: true,
    autoLock: '5min' as 'never' | '1min' | '5min' | '15min' | '30min',
    dataUsage: 'wifi' as 'always' | 'wifi' | 'never',
    crashReporting: true,
    analytics: false,
  });

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  const handleToggleBiometric = () => {
    if (!biometricAvailable) {
      Alert.alert(
        'Biometric Authentication Unavailable',
        'Your device does not support biometric authentication or it is not set up.'
      );
      return;
    }

    updateUser({ biometricEnabled: !user?.biometricEnabled });
  };

  const handleSaveProfile = () => {
    updateUser({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
    });
    setShowEditProfile(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleSavePrivacySettings = () => {
    updateUser({ isAnonymous: privacySettings.isAnonymous });
    setShowPrivacySettings(false);
    Alert.alert('Success', 'Privacy settings updated!');
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'For security reasons, password changes require email verification. Check your email for instructions.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deletion', 'Account deletion request submitted. You will receive confirmation via email.');
          },
        },
      ]
    );
  };

  const profileSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'edit-profile',
          title: 'Edit Profile',
          icon: Edit,
          subtitle: 'Update your personal information',
          onPress: () => setShowEditProfile(true),
        },
        {
          id: 'privacy',
          title: 'Privacy Settings',
          icon: user?.isAnonymous ? EyeOff : Eye,
          subtitle: user?.isAnonymous ? 'Anonymous Mode' : 'Public Profile',
          onPress: () => setShowPrivacySettings(true),
        },
        {
          id: 'biometric',
          title: 'Biometric Authentication',
          icon: Fingerprint,
          subtitle: user?.biometricEnabled ? 'Enabled' : 'Disabled',
          onPress: handleToggleBiometric,
          disabled: !biometricAvailable,
        },
      ],
    },
    {
      title: 'Security & Safety',
      items: [
        {
          id: 'security',
          title: 'Security Settings',
          icon: Shield,
          subtitle: 'Password and account security',
          onPress: () => setShowSecuritySettings(true),
        },
        {
          id: 'notifications',
          title: 'Notifications',
          icon: Bell,
          subtitle: 'Manage your notification preferences',
          onPress: () => setShowNotificationSettings(true),
        },
        {
          id: 'emergency-contacts',
          title: 'Emergency Contacts',
          icon: Phone,
          subtitle: `${user?.emergencyContacts?.length || 0} contacts`,
          onPress: () => router.push('/safety'),
        },
      ],
    },
    {
      title: 'App & Support',
      items: [
        {
          id: 'wellbeing',
          title: 'Wellbeing Resources',
          icon: Heart,
          subtitle: 'Access mental health tools',
          onPress: () => router.push('/wellbeing'),
        },
        {
          id: 'reports',
          title: 'My Reports',
          icon: FileText,
          subtitle: 'View and manage your reports',
          onPress: () => router.push('/reports'),
        },
        {
          id: 'help',
          title: 'Help & Support',
          icon: HelpCircle,
          subtitle: 'Get help and contact support',
          onPress: () => router.push('/emergency'),
        },
        {
          id: 'settings',
          title: 'App Settings',
          icon: Settings,
          subtitle: 'Language, theme, and preferences',
          onPress: () => setShowAppSettings(true),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <User color="#6A2CB0" size={32} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.isAnonymous 
                ? 'Anonymous User' 
                : `${user?.firstName} ${user?.lastName}`
              }
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>
                {user?.role === 'survivor' ? 'Survivor' : 'Healthcare Provider'}
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionItems}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.sectionItem,
                    item.disabled && styles.sectionItemDisabled,
                    index === section.items.length - 1 && styles.sectionItemLast,
                  ]}
                  onPress={item.onPress}
                  disabled={item.disabled}
                  testID={`profile-${item.id}`}
                >
                  <View style={styles.sectionItemIcon}>
                    <item.icon 
                      color={item.disabled ? '#D8CEE8' : '#6A2CB0'} 
                      size={20} 
                    />
                  </View>
                  <View style={styles.sectionItemContent}>
                    <Text 
                      style={[
                        styles.sectionItemTitle,
                        item.disabled && styles.sectionItemTitleDisabled,
                      ]}
                    >
                      {item.title}
                    </Text>
                    {item.subtitle && (
                      <Text 
                        style={[
                          styles.sectionItemSubtitle,
                          item.disabled && styles.sectionItemSubtitleDisabled,
                        ]}
                      >
                        {item.subtitle}
                      </Text>
                    )}
                  </View>
                  <ChevronRight 
                    color={item.disabled ? '#D8CEE8' : '#49455A'} 
                    size={16} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            testID="logout-button"
          >
            <LogOut color="#E53935" size={20} />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Kintaraa v1.0.0</Text>
          <Text style={styles.appInfoText}>
            Your safety and privacy are our priority
          </Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity 
              onPress={() => setShowEditProfile(false)}
              style={styles.modalCloseButton}
            >
              <X color="#49455A" size={24} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.firstName}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, firstName: text }))}
                placeholder="Enter your first name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.lastName}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, lastName: text }))}
                placeholder="Enter your last name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.email}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowEditProfile(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.modalSaveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Privacy Settings Modal */}
      <Modal
        visible={showPrivacySettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy Settings</Text>
            <TouchableOpacity 
              onPress={() => setShowPrivacySettings(false)}
              style={styles.modalCloseButton}
            >
              <X color="#49455A" size={24} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Anonymous Mode</Text>
                <Text style={styles.settingDescription}>
                  Hide your identity in reports and communications
                </Text>
              </View>
              <Switch
                value={privacySettings.isAnonymous}
                onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, isAnonymous: value }))}
                trackColor={{ false: '#D8CEE8', true: '#6A2CB0' }}
                thumbColor={privacySettings.isAnonymous ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Share Location</Text>
                <Text style={styles.settingDescription}>
                  Allow sharing your location with emergency contacts
                </Text>
              </View>
              <Switch
                value={privacySettings.shareLocation}
                onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, shareLocation: value }))}
                trackColor={{ false: '#D8CEE8', true: '#6A2CB0' }}
                thumbColor={privacySettings.shareLocation ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Allow Messages</Text>
                <Text style={styles.settingDescription}>
                  Allow service providers to send you messages
                </Text>
              </View>
              <Switch
                value={privacySettings.allowMessages}
                onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, allowMessages: value }))}
                trackColor={{ false: '#D8CEE8', true: '#6A2CB0' }}
                thumbColor={privacySettings.allowMessages ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowPrivacySettings(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={handleSavePrivacySettings}
            >
              <Text style={styles.modalSaveText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Security Settings Modal */}
      <Modal
        visible={showSecuritySettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Security Settings</Text>
            <TouchableOpacity 
              onPress={() => setShowSecuritySettings(false)}
              style={styles.modalCloseButton}
            >
              <X color="#49455A" size={24} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <TouchableOpacity style={styles.securityOption} onPress={handleChangePassword}>
              <View style={styles.securityOptionIcon}>
                <Lock color="#6A2CB0" size={20} />
              </View>
              <View style={styles.securityOptionContent}>
                <Text style={styles.securityOptionTitle}>Change Password</Text>
                <Text style={styles.securityOptionDescription}>
                  Update your account password
                </Text>
              </View>
              <ChevronRight color="#49455A" size={16} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.securityOption} onPress={handleToggleBiometric}>
              <View style={styles.securityOptionIcon}>
                <Fingerprint color="#6A2CB0" size={20} />
              </View>
              <View style={styles.securityOptionContent}>
                <Text style={styles.securityOptionTitle}>Biometric Login</Text>
                <Text style={styles.securityOptionDescription}>
                  {user?.biometricEnabled ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
              <Switch
                value={user?.biometricEnabled || false}
                onValueChange={handleToggleBiometric}
                trackColor={{ false: '#D8CEE8', true: '#6A2CB0' }}
                thumbColor={user?.biometricEnabled ? '#FFFFFF' : '#FFFFFF'}
                disabled={!biometricAvailable}
              />
            </TouchableOpacity>
            
            <View style={styles.dangerZone}>
              <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
              <TouchableOpacity style={styles.dangerOption} onPress={handleDeleteAccount}>
                <Text style={styles.dangerOptionText}>Delete Account</Text>
                <Text style={styles.dangerOptionDescription}>
                  Permanently delete your account and all data
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Notification Settings Modal */}
      <Modal
        visible={showNotificationSettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notification Settings</Text>
            <TouchableOpacity 
              onPress={() => setShowNotificationSettings(false)}
              style={styles.modalCloseButton}
            >
              <X color="#49455A" size={24} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive notifications on your device
                </Text>
              </View>
              <Switch
                value={notificationSettings.pushNotifications}
                onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, pushNotifications: value }))}
                trackColor={{ false: '#D8CEE8', true: '#6A2CB0' }}
                thumbColor={notificationSettings.pushNotifications ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Emergency Alerts</Text>
                <Text style={styles.settingDescription}>
                  Critical safety and emergency notifications
                </Text>
              </View>
              <Switch
                value={notificationSettings.emergencyAlerts}
                onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, emergencyAlerts: value }))}
                trackColor={{ false: '#D8CEE8', true: '#6A2CB0' }}
                thumbColor={notificationSettings.emergencyAlerts ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Case Updates</Text>
                <Text style={styles.settingDescription}>
                  Updates about your reports and cases
                </Text>
              </View>
              <Switch
                value={notificationSettings.caseUpdates}
                onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, caseUpdates: value }))}
                trackColor={{ false: '#D8CEE8', true: '#6A2CB0' }}
                thumbColor={notificationSettings.caseUpdates ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Email Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive notifications via email
                </Text>
              </View>
              <Switch
                value={notificationSettings.emailNotifications}
                onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, emailNotifications: value }))}
                trackColor={{ false: '#D8CEE8', true: '#6A2CB0' }}
                thumbColor={notificationSettings.emailNotifications ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={() => {
                setShowNotificationSettings(false);
                Alert.alert('Success', 'Notification settings updated!');
              }}
            >
              <Text style={styles.modalSaveText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* App Settings Modal */}
      <Modal
        visible={showAppSettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>App Settings</Text>
            <TouchableOpacity 
              onPress={() => setShowAppSettings(false)}
              style={styles.modalCloseButton}
            >
              <X color="#49455A" size={24} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {/* Appearance Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Appearance</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Theme</Text>
                  <Text style={styles.settingDescription}>
                    Choose your preferred app theme
                  </Text>
                </View>
                <View style={styles.themeSelector}>
                  {(['light', 'dark', 'system'] as const).map((theme) => (
                    <TouchableOpacity
                      key={theme}
                      style={[
                        styles.themeOption,
                        appSettings.theme === theme && styles.themeOptionSelected,
                      ]}
                      onPress={() => setAppSettings(prev => ({ ...prev, theme }))}
                    >
                      {theme === 'light' && <Sun color={appSettings.theme === theme ? '#FFFFFF' : '#6A2CB0'} size={16} />}
                      {theme === 'dark' && <Moon color={appSettings.theme === theme ? '#FFFFFF' : '#6A2CB0'} size={16} />}
                      {theme === 'system' && <Smartphone color={appSettings.theme === theme ? '#FFFFFF' : '#6A2CB0'} size={16} />}
                      <Text style={[
                        styles.themeOptionText,
                        appSettings.theme === theme && styles.themeOptionTextSelected,
                      ]}>
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Language</Text>
                  <Text style={styles.settingDescription}>
                    Select your preferred language
                  </Text>
                </View>
                <View style={styles.languageSelector}>
                  {[
                    { code: 'en', name: 'English' },
                    { code: 'es', name: 'Español' },
                    { code: 'fr', name: 'Français' },
                    { code: 'sw', name: 'Kiswahili' },
                  ].map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.languageOption,
                        appSettings.language === lang.code && styles.languageOptionSelected,
                      ]}
                      onPress={() => setAppSettings(prev => ({ ...prev, language: lang.code as any }))}
                    >
                      <Text style={[
                        styles.languageOptionText,
                        appSettings.language === lang.code && styles.languageOptionTextSelected,
                      ]}>
                        {lang.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Audio & Haptics Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Audio & Haptics</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <View style={styles.settingTitleRow}>
                    {appSettings.soundEnabled ? (
                      <Volume2 color="#6A2CB0" size={20} />
                    ) : (
                      <VolumeX color="#6A2CB0" size={20} />
                    )}
                    <Text style={styles.settingTitle}>Sound Effects</Text>
                  </View>
                  <Text style={styles.settingDescription}>
                    Play sounds for app interactions
                  </Text>
                </View>
                <Switch
                  value={appSettings.soundEnabled}
                  onValueChange={(value) => setAppSettings(prev => ({ ...prev, soundEnabled: value }))}
                  trackColor={{ false: '#D8CEE8', true: '#6A2CB0' }}
                  thumbColor={appSettings.soundEnabled ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Haptic Feedback</Text>
                  <Text style={styles.settingDescription}>
                    Feel vibrations for button taps and interactions
                  </Text>
                </View>
                <Switch
                  value={appSettings.hapticsEnabled}
                  onValueChange={(value) => setAppSettings(prev => ({ ...prev, hapticsEnabled: value }))}
                  trackColor={{ false: '#D8CEE8', true: '#6A2CB0' }}
                  thumbColor={appSettings.hapticsEnabled ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            </View>

            {/* Security Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Security</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Auto-Lock</Text>
                  <Text style={styles.settingDescription}>
                    Automatically lock the app after inactivity
                  </Text>
                </View>
                <View style={styles.autoLockSelector}>
                  {[
                    { value: 'never', label: 'Never' },
                    { value: '1min', label: '1 min' },
                    { value: '5min', label: '5 min' },
                    { value: '15min', label: '15 min' },
                    { value: '30min', label: '30 min' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.autoLockOption,
                        appSettings.autoLock === option.value && styles.autoLockOptionSelected,
                      ]}
                      onPress={() => setAppSettings(prev => ({ ...prev, autoLock: option.value as any }))}
                    >
                      <Text style={[
                        styles.autoLockOptionText,
                        appSettings.autoLock === option.value && styles.autoLockOptionTextSelected,
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Data & Privacy Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Data & Privacy</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Data Usage</Text>
                  <Text style={styles.settingDescription}>
                    Control when the app uses mobile data
                  </Text>
                </View>
                <View style={styles.dataUsageSelector}>
                  {[
                    { value: 'always', label: 'Always' },
                    { value: 'wifi', label: 'Wi-Fi Only' },
                    { value: 'never', label: 'Never' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dataUsageOption,
                        appSettings.dataUsage === option.value && styles.dataUsageOptionSelected,
                      ]}
                      onPress={() => setAppSettings(prev => ({ ...prev, dataUsage: option.value as any }))}
                    >
                      <Text style={[
                        styles.dataUsageOptionText,
                        appSettings.dataUsage === option.value && styles.dataUsageOptionTextSelected,
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Crash Reporting</Text>
                  <Text style={styles.settingDescription}>
                    Help improve the app by sharing crash reports
                  </Text>
                </View>
                <Switch
                  value={appSettings.crashReporting}
                  onValueChange={(value) => setAppSettings(prev => ({ ...prev, crashReporting: value }))}
                  trackColor={{ false: '#D8CEE8', true: '#6A2CB0' }}
                  thumbColor={appSettings.crashReporting ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Analytics</Text>
                  <Text style={styles.settingDescription}>
                    Share anonymous usage data to improve the app
                  </Text>
                </View>
                <Switch
                  value={appSettings.analytics}
                  onValueChange={(value) => setAppSettings(prev => ({ ...prev, analytics: value }))}
                  trackColor={{ false: '#D8CEE8', true: '#6A2CB0' }}
                  thumbColor={appSettings.analytics ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            </View>

            {/* Storage Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Storage</Text>
              
              <TouchableOpacity style={styles.storageOption}>
                <View style={styles.storageOptionIcon}>
                  <Download color="#6A2CB0" size={20} />
                </View>
                <View style={styles.storageOptionContent}>
                  <Text style={styles.storageOptionTitle}>Download Data</Text>
                  <Text style={styles.storageOptionDescription}>
                    Export your data for backup or transfer
                  </Text>
                </View>
                <ChevronRight color="#49455A" size={16} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.storageOption}
                onPress={() => {
                  Alert.alert(
                    'Clear Cache',
                    'This will clear temporary files and may improve app performance. Your personal data will not be affected.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Clear Cache', 
                        onPress: () => Alert.alert('Success', 'Cache cleared successfully!') 
                      },
                    ]
                  );
                }}
              >
                <View style={styles.storageOptionIcon}>
                  <Trash2 color="#6A2CB0" size={20} />
                </View>
                <View style={styles.storageOptionContent}>
                  <Text style={styles.storageOptionTitle}>Clear Cache</Text>
                  <Text style={styles.storageOptionDescription}>
                    Free up space by clearing temporary files
                  </Text>
                </View>
                <ChevronRight color="#49455A" size={16} />
              </TouchableOpacity>
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={() => {
                setShowAppSettings(false);
                Alert.alert('Success', 'App settings updated!');
              }}
            >
              <Text style={styles.modalSaveText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  },
  scrollContent: {
    paddingBottom: 24,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#49455A',
    marginBottom: 8,
  },
  userBadge: {
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  userBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  sectionItems: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0FF',
  },
  sectionItemLast: {
    borderBottomWidth: 0,
  },
  sectionItemDisabled: {
    opacity: 0.5,
  },
  sectionItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionItemContent: {
    flex: 1,
  },
  sectionItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 2,
  },
  sectionItemTitleDisabled: {
    color: '#D8CEE8',
  },
  sectionItemSubtitle: {
    fontSize: 14,
    color: '#49455A',
  },
  sectionItemSubtitleDisabled: {
    color: '#D8CEE8',
  },
  logoutSection: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E53935',
    gap: 8,
  },
  logoutButtonText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  appInfoText: {
    fontSize: 12,
    color: '#49455A',
    textAlign: 'center',
    lineHeight: 16,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D8CEE8',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#D8CEE8',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F5F0FF',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6A2CB0',
  },
  modalCancelText: {
    color: '#6A2CB0',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#6A2CB0',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Form Styles
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D8CEE8',
  },
  // Settings Styles
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 18,
  },
  // Security Settings Styles
  securityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  securityOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  securityOptionContent: {
    flex: 1,
  },
  securityOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 4,
  },
  securityOptionDescription: {
    fontSize: 14,
    color: '#49455A',
  },
  dangerZone: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#D8CEE8',
  },
  dangerZoneTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E53935',
    marginBottom: 16,
  },
  dangerOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E53935',
  },
  dangerOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53935',
    marginBottom: 4,
  },
  dangerOptionDescription: {
    fontSize: 14,
    color: '#E53935',
    opacity: 0.7,
  },
  // App Settings Styles
  settingsSection: {
    marginBottom: 32,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 16,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  // Theme Selector
  themeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6A2CB0',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  themeOptionSelected: {
    backgroundColor: '#6A2CB0',
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  themeOptionTextSelected: {
    color: '#FFFFFF',
  },
  // Language Selector
  languageSelector: {
    gap: 8,
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8CEE8',
    backgroundColor: '#FFFFFF',
  },
  languageOptionSelected: {
    borderColor: '#6A2CB0',
    backgroundColor: '#F5F0FF',
  },
  languageOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#341A52',
    textAlign: 'center',
  },
  languageOptionTextSelected: {
    color: '#6A2CB0',
    fontWeight: '600',
  },
  // Auto Lock Selector
  autoLockSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  autoLockOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8CEE8',
    backgroundColor: '#FFFFFF',
  },
  autoLockOptionSelected: {
    borderColor: '#6A2CB0',
    backgroundColor: '#6A2CB0',
  },
  autoLockOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#341A52',
  },
  autoLockOptionTextSelected: {
    color: '#FFFFFF',
  },
  // Data Usage Selector
  dataUsageSelector: {
    gap: 8,
  },
  dataUsageOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8CEE8',
    backgroundColor: '#FFFFFF',
  },
  dataUsageOptionSelected: {
    borderColor: '#6A2CB0',
    backgroundColor: '#F5F0FF',
  },
  dataUsageOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#341A52',
    textAlign: 'center',
  },
  dataUsageOptionTextSelected: {
    color: '#6A2CB0',
    fontWeight: '600',
  },
  // Storage Options
  storageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  storageOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  storageOptionContent: {
    flex: 1,
  },
  storageOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 4,
  },
  storageOptionDescription: {
    fontSize: 14,
    color: '#49455A',
  },
});