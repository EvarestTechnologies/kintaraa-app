import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HotlineSupport from '@/dashboards/gbv_rescue/components/HotlineSupport';

export default function HotlineScreen() {
  console.log('📞 HotlineScreen - GBV Hotline Support');

  return (
    <SafeAreaView style={styles.container}>
      <HotlineSupport />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});