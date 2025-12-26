import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast, ToastType, ToastProps } from '@/components/Toast';

interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastData, 'id'>) => void;
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const insets = useSafeAreaInsets();

  const showToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = { ...toast, id };

    setToasts((prev) => {
      // Limit to max 3 toasts on screen
      const updatedToasts = [newToast, ...prev];
      return updatedToasts.slice(0, 3);
    });
  }, []);

  const showSuccess = useCallback(
    (title: string, message?: string, duration = 5000) => {
      showToast({ type: 'success', title, message, duration });
    },
    [showToast]
  );

  const showError = useCallback(
    (title: string, message?: string, duration = 7000) => {
      showToast({ type: 'error', title, message, duration });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (title: string, message?: string, duration = 6000) => {
      showToast({ type: 'warning', title, message, duration });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (title: string, message?: string, duration = 5000) => {
      showToast({ type: 'info', title, message, duration });
    },
    [showToast]
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextValue = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissToast,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Container */}
      <View
        style={[
          styles.toastContainer,
          {
            top: Platform.OS === 'web' ? 20 : insets.top + 10,
          },
        ]}
        pointerEvents="box-none"
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onDismiss={dismissToast}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 9999,
    ...(Platform.OS === 'web' ? {
      position: 'fixed' as any,
    } : {}),
  },
});

/**
 * Hook to use toast notifications
 *
 * @example
 * ```tsx
 * const toast = useToast();
 *
 * // Simple success toast
 * toast.showSuccess('Success!', 'Your changes have been saved');
 *
 * // Error toast with custom duration
 * toast.showError('Failed to save', 'Please try again', 10000);
 *
 * // Custom toast
 * toast.showToast({
 *   type: 'warning',
 *   title: 'Warning',
 *   message: 'This action cannot be undone',
 *   duration: 0, // Won't auto-dismiss
 * });
 * ```
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
