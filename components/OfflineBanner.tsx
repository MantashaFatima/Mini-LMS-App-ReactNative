import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface OfflineBannerProps {
  visible: boolean;
}

export function OfflineBanner({ visible }: OfflineBannerProps) {
  if (!visible) return null;

  return (
    <View className="bg-orange-500 px-4 py-2 flex-row items-center">
      <Ionicons name="warning" size={20} color="white" />
      <Text className="text-white ml-2 font-medium">
        You&apos;re offline. Some features may not work.
      </Text>
    </View>
  );
}