import React from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
}

export default function ProgressBar({ 
  progress, 
  height = 8, 
  backgroundColor = '#E5E7EB',
  fillColor = '#10B981'
}: ProgressBarProps) {
  return (
    <View 
      className="rounded-full overflow-hidden"
      style={{ height, backgroundColor }}
    >
      <View 
        className="h-full rounded-full"
        style={{ 
          width: `${Math.max(0, Math.min(100, progress * 100))}%`,
          backgroundColor: fillColor
        }}
      />
    </View>
  );
}