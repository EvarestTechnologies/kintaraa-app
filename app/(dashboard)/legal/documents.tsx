import React from 'react';
import { View, StyleSheet } from 'react-native';
import DocumentsList from '@/dashboards/legal/components/DocumentsList';

export default function DocumentsScreen() {
  console.log('📄 DocumentsScreen - Legal Documents');

  return (
    <View style={styles.container}>
      <DocumentsList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});