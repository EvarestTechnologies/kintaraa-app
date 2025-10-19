/**
 * Notification Bell Icon Component
 * Bell icon with badge for unread notifications
 */

import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { NotificationBadge } from './NotificationBadge';
import { useNotifications } from '@/providers/NotificationProvider';
import { router } from 'expo-router';

interface NotificationBellIconProps {
  size?: number;
  color?: string;
  onPress?: () => void;
}

export function NotificationBellIcon({
  size = 24,
  color = '#FFFFFF',
  onPress,
}: NotificationBellIconProps) {
  const { unreadCount } = useNotifications();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default: Navigate to notifications screen
      router.push('/notifications' as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
      accessibilityLabel={`Notifications. ${unreadCount} unread`}
      accessibilityRole="button"
    >
      <View style={styles.iconContainer}>
        <Bell size={size} color={color} />
        {unreadCount > 0 && (
          <View style={styles.badgeContainer}>
            <NotificationBadge count={unreadCount} size="small" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  iconContainer: {
    position: 'relative',
    width: 24,
    height: 24,
  },
  badgeContainer: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
});
