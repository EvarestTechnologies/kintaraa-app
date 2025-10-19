/**
 * Notification Badge Component
 * Displays unread notification count as a badge
 */

import { View, Text, StyleSheet } from 'react-native';

interface NotificationBadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  textColor?: string;
  maxCount?: number;
}

export function NotificationBadge({
  count,
  size = 'medium',
  color = '#E53935',
  textColor = '#FFFFFF',
  maxCount = 99,
}: NotificationBadgeProps) {
  if (count === 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const sizeStyles = {
    small: { width: 16, height: 16, fontSize: 10 },
    medium: { width: 20, height: 20, fontSize: 12 },
    large: { width: 24, height: 24, fontSize: 14 },
  };

  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color,
          width: currentSize.width,
          height: currentSize.height,
          minWidth: currentSize.width,
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color: textColor,
            fontSize: currentSize.fontSize,
          },
        ]}
        numberOfLines={1}
      >
        {displayCount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
