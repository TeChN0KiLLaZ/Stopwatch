import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>About StopWatch App</ThemedText>
        
        <ThemedText style={styles.paragraph}>
          This stopwatch app is a simple lightweight stopwatch built with React Native and Expo.
          It allows you to track time with precision, record laps, and manage your timing needs with ease with no ads.
        </ThemedText>
        
        <ThemedText style={styles.heading}>Features:</ThemedText>
        <ThemedText style={styles.listItem}>• Start, pause, and stop the timer</ThemedText>
        <ThemedText style={styles.listItem}>• Record and store lap times</ThemedText>
        <ThemedText style={styles.listItem}>• Individual lap deletion</ThemedText>
        <ThemedText style={styles.listItem}>• Persistent storage of your lap data</ThemedText>
        
        <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    marginBottom: 24,
    color: '#ffffff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    color: '#ffffff',
  },
  paragraph: {
    marginBottom: 16,
    lineHeight: 22,
    color: '#ffffff',
  },
  listItem: {
    marginBottom: 8,
    paddingLeft: 8,
    color: '#ffffff',
  },
  version: {
    marginTop: 40,
    textAlign: 'center',
    color: '#888888',
  }
});