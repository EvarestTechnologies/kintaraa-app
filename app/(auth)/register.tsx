import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth, ProviderType } from '@/providers/AuthProvider';
import { ArrowLeft, Eye, EyeOff, User, UserCheck, Stethoscope, Scale, Shield, Heart, Users, LifeBuoy, Home } from 'lucide-react-native';

export default function RegisterScreen() {
  const { register, isRegistering, registerError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'survivor' as 'survivor' | 'provider',
    providerType: undefined as ProviderType | undefined,
    isAnonymous: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = () => {
    const { firstName, lastName, email, password, confirmPassword, role, providerType, isAnonymous } = formData;

    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!isAnonymous && (!firstName.trim() || !lastName.trim())) {
      Alert.alert('Error', 'Please enter your name or choose anonymous registration');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (role === 'provider' && !providerType) {
      Alert.alert('Error', 'Please select your provider type');
      return;
    }

    register({
      firstName: isAnonymous ? 'Anonymous' : firstName.trim(),
      lastName: isAnonymous ? 'User' : lastName.trim(),
      email: email.trim(),
      password,
      role,
      providerType: role === 'provider' ? providerType : undefined,
      isAnonymous,
    });
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const providerTypes = [
    { type: 'healthcare' as ProviderType, label: 'Healthcare', icon: Stethoscope, color: '#10B981' },
    { type: 'legal' as ProviderType, label: 'Legal', icon: Scale, color: '#3B82F6' },
    { type: 'police' as ProviderType, label: 'Police', icon: Shield, color: '#EF4444' },
    { type: 'counseling' as ProviderType, label: 'Counseling', icon: Heart, color: '#F59E0B' },
    { type: 'social' as ProviderType, label: 'Social Services', icon: Users, color: '#8B5CF6' },
    { type: 'gbv_rescue' as ProviderType, label: 'GBV Rescue Center', icon: LifeBuoy, color: '#DC2626' },
    { type: 'chw' as ProviderType, label: 'Community Health Worker', icon: Home, color: '#059669' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              testID="back-button"
            >
              <ArrowLeft color="#341A52" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our safe community</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.roleSelector}>
              <Text style={styles.label}>I am a:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'survivor' && styles.roleButtonActive,
                  ]}
                  onPress={() => updateFormData('role', 'survivor')}
                  testID="survivor-role-button"
                >
                  <User
                    color={formData.role === 'survivor' ? '#FFFFFF' : '#6A2CB0'}
                    size={20}
                  />
                  <Text
                    style={[
                      styles.roleButtonText,
                      formData.role === 'survivor' && styles.roleButtonTextActive,
                    ]}
                  >
                    Survivor
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'provider' && styles.roleButtonActive,
                  ]}
                  onPress={() => updateFormData('role', 'provider')}
                  testID="provider-role-button"
                >
                  <UserCheck
                    color={formData.role === 'provider' ? '#FFFFFF' : '#6A2CB0'}
                    size={20}
                  />
                  <Text
                    style={[
                      styles.roleButtonText,
                      formData.role === 'provider' && styles.roleButtonTextActive,
                    ]}
                  >
                    Provider
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {formData.role === 'provider' && (
              <View style={styles.providerTypeSelector}>
                <Text style={styles.label}>Provider Type:</Text>
                <View style={styles.providerTypeGrid}>
                  {providerTypes.map(({ type, label, icon: Icon, color }) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.providerTypeButton,
                        formData.providerType === type && {
                          ...styles.providerTypeButtonActive,
                          borderColor: color,
                          backgroundColor: color + '10',
                        },
                      ]}
                      onPress={() => updateFormData('providerType', type)}
                      testID={`provider-type-${type}`}
                    >
                      <Icon
                        color={formData.providerType === type ? color : '#6A2CB0'}
                        size={24}
                      />
                      <Text
                        style={[
                          styles.providerTypeText,
                          formData.providerType === type && {
                            color: color,
                            fontWeight: '700',
                          },
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.anonymousToggle}
              onPress={() => updateFormData('isAnonymous', !formData.isAnonymous)}
              testID="anonymous-toggle"
            >
              <View
                style={[
                  styles.checkbox,
                  formData.isAnonymous && styles.checkboxActive,
                ]}
              >
                {formData.isAnonymous && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.anonymousText}>Register anonymously</Text>
            </TouchableOpacity>

            {!formData.isAnonymous && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={(value) => updateFormData('firstName', value)}
                    placeholder="Enter your first name"
                    placeholderTextColor="#D8CEE8"
                    testID="first-name-input"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(value) => updateFormData('lastName', value)}
                    placeholder="Enter your last name"
                    placeholderTextColor="#D8CEE8"
                    testID="last-name-input"
                  />
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                placeholder="Enter your email"
                placeholderTextColor="#D8CEE8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                testID="email-input"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
                  placeholder="Create a password"
                  placeholderTextColor="#D8CEE8"
                  secureTextEntry={!showPassword}
                  testID="password-input"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  testID="toggle-password-visibility"
                >
                  {showPassword ? (
                    <EyeOff color="#D8CEE8" size={20} />
                  ) : (
                    <Eye color="#D8CEE8" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateFormData('confirmPassword', value)}
                  placeholder="Confirm your password"
                  placeholderTextColor="#D8CEE8"
                  secureTextEntry={!showConfirmPassword}
                  testID="confirm-password-input"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  testID="toggle-confirm-password-visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff color="#D8CEE8" size={20} />
                  ) : (
                    <Eye color="#D8CEE8" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {registerError && (
              <Text style={styles.errorText}>{registerError}</Text>
            )}

            <TouchableOpacity
              style={[styles.registerButton, isRegistering && styles.disabledButton]}
              onPress={handleRegister}
              disabled={isRegistering}
              testID="register-button"
            >
              <Text style={styles.registerButtonText}>
                {isRegistering ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              testID="login-link"
            >
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  form: {
    flex: 1,
  },
  roleSelector: {
    marginBottom: 24,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#6A2CB0',
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: '#6A2CB0',
  },
  roleButtonText: {
    color: '#6A2CB0',
    fontSize: 16,
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  anonymousToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  anonymousText: {
    color: '#341A52',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#341A52',
    borderWidth: 1,
    borderColor: '#D8CEE8',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8CEE8',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#341A52',
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  errorText: {
    color: '#E53935',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#6A2CB0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    color: '#49455A',
    fontSize: 16,
  },
  footerLink: {
    color: '#6A2CB0',
    fontSize: 16,
    fontWeight: '600',
  },
  providerTypeSelector: {
    marginBottom: 24,
  },
  providerTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  providerTypeButton: {
    width: '48%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#6A2CB0',
    gap: 8,
    minHeight: 80,
  },
  providerTypeButtonActive: {
    borderWidth: 2,
  },
  providerTypeText: {
    color: '#6A2CB0',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});