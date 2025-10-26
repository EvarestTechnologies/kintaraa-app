import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onDismiss,
}) => {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(-100);

  useEffect(() => {
    // Slide in and fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after duration
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(id);
    });
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: '#10B981',
          border: '#059669',
          icon: CheckCircle,
        };
      case 'error':
        return {
          bg: '#EF4444',
          border: '#DC2626',
          icon: AlertCircle,
        };
      case 'warning':
        return {
          bg: '#F59E0B',
          border: '#D97706',
          icon: AlertTriangle,
        };
      case 'info':
        return {
          bg: '#3B82F6',
          border: '#2563EB',
          icon: Info,
        };
    }
  };

  const colors = getColors();
  const Icon = colors.icon;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        backgroundColor: colors.bg,
        borderLeftWidth: 4,
        borderLeftColor: colors.border,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        width: Platform.OS === 'web' ? 400 : '100%',
        maxWidth: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}
    >
      <View style={{ marginRight: 12, marginTop: 2 }}>
        <Icon color="#FFFFFF" size={24} />
      </View>

      <View style={{ flex: 1, marginRight: 8 }}>
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
            marginBottom: message ? 4 : 0,
          }}
        >
          {title}
        </Text>
        {message && (
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 14,
              opacity: 0.9,
              lineHeight: 20,
            }}
          >
            {message}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleDismiss}
        style={{
          padding: 4,
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X color="#FFFFFF" size={20} />
      </TouchableOpacity>
    </Animated.View>
  );
};
