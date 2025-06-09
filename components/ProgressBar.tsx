import React from 'react';
import { View, StyleSheet } from 'react-native';

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
    <View style={[styles.container, { height, backgroundColor }]}>
      <View 
        style={[
          styles.fill, 
          { 
            width: `${Math.max(0, Math.min(100, progress * 100))}%`,
            backgroundColor: fillColor
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});