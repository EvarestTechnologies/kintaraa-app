/**
 * Network Detection Hook
 * Monitors network connectivity and provides online/offline status
 */

import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { NetworkState, UseNetworkReturn } from '@/types/offline.types';
import { logger } from '@/utils/logger';
import { offlineConfig } from '@/utils/configLoader';

export function useNetwork(): UseNetworkReturn {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: false,
    isInternetReachable: null,
    type: 'unknown',
    quality: 'unknown',
  });

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const newState: NetworkState = {
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: mapNetInfoType(state.type),
        quality: determineQuality(state),
      };

      setNetworkState(newState);

      logger.network.info('Network state changed', {
        isConnected: newState.isConnected,
        type: newState.type,
        quality: newState.quality,
      });
    });

    // Fetch initial state
    NetInfo.fetch().then((state) => {
      const initialState: NetworkState = {
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: mapNetInfoType(state.type),
        quality: determineQuality(state),
      };

      setNetworkState(initialState);

      logger.network.debug('Initial network state', initialState);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const isOnline =
    networkState.isConnected &&
    (networkState.isInternetReachable === null || networkState.isInternetReachable === true);

  return {
    isOnline,
    isConnected: networkState.isConnected,
    networkState,
    connectionQuality: networkState.quality || 'unknown',
  };
}

/**
 * Map NetInfo type to our NetworkState type
 */
function mapNetInfoType(type: string): NetworkState['type'] {
  switch (type) {
    case 'wifi':
      return 'wifi';
    case 'cellular':
      return 'cellular';
    case 'ethernet':
      return 'ethernet';
    case 'none':
      return 'none';
    default:
      return 'unknown';
  }
}

/**
 * Determine connection quality based on NetInfo details
 */
function determineQuality(state: NetInfoState): NetworkState['quality'] {
  if (!state.isConnected) {
    return 'poor';
  }

  // WiFi typically has good quality
  if (state.type === 'wifi') {
    return 'excellent';
  }

  // Cellular quality depends on details
  if (state.type === 'cellular' && state.details) {
    const details = state.details as any;

    // Check cellular generation
    if (details.cellularGeneration) {
      switch (details.cellularGeneration) {
        case '5g':
          return 'excellent';
        case '4g':
          return 'good';
        case '3g':
          return 'moderate';
        case '2g':
          return 'poor';
      }
    }
  }

  // Ethernet is typically excellent
  if (state.type === 'ethernet') {
    return 'excellent';
  }

  // Default to moderate if connected but can't determine
  return 'moderate';
}
