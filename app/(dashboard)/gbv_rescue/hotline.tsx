import React from 'react';
import { View, StyleSheet } from 'react-native';
import HotlineSupport from '@/dashboards/gbv_rescue/components/HotlineSupport';

export default function HotlineScreen() {
  console.log('📞 HotlineScreen - GBV Hotline Support');

  return (
    <View style={styles.container}>
      <HotlineSupport />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});