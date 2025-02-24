import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  // State definitions
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);

  // Load laps from AsyncStorage when the component mounts
  useEffect(() => {
    const loadLaps = async () => {
      try {
        const lapsJson = await AsyncStorage.getItem('laps');
        if (lapsJson) {
          setLaps(JSON.parse(lapsJson));
        }
      } catch (error) {
        console.error('Failed to load laps:', error);
      }
    };
    loadLaps();
  }, []); // Empty dependency array means this runs once on mount

  // Save laps to AsyncStorage whenever the laps state changes
  useEffect(() => {
    const saveLaps = async () => {
      try {
        await AsyncStorage.setItem('laps', JSON.stringify(laps));
      } catch (error) {
        console.error('Failed to save laps:', error);
      }
    };
    saveLaps();
  }, [laps]); // Runs whenever `laps` changes

  // Effect to update the timer when running
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime(accumulatedTime + (Date.now() - startTime));
      }, 10);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, accumulatedTime, startTime]);

  // Stopwatch control functions
  const start = () => {
    if (!isRunning) {
      setStartTime(Date.now());
      setIsRunning(true);
    }
  };

  const pause = () => {
    if (isRunning) {
      setAccumulatedTime(accumulatedTime + (Date.now() - startTime));
      setIsRunning(false);
    }
  };

  const stop = () => {
    setIsRunning(false);
    setAccumulatedTime(0);
    setCurrentTime(0);
    setLaps([]); // Clears laps, triggering the save effect
  };

  const recordLap = () => {
    if (isRunning) {
      setLaps([...laps, currentTime]); // Adds new lap, triggering the save effect
    }
  };

  const clearLaps = () => {
    setLaps([]); // Clears laps, triggering the save effect
  };

  // Format time into MM:SS.MS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Text
            style={styles.timer}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.5}
          >
            {formatTime(currentTime)}
          </Text>
        </View>

        {/* Control Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { transform: [{ scale: 1.05 }] },
            ]}
            onPress={start}
          >
            <Ionicons name="play" size={24} color="#fff" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { transform: [{ scale: 1.05 }] },
            ]}
            onPress={pause}
          >
            <Ionicons name="pause" size={24} color="#fff" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { transform: [{ scale: 1.05 }] },
            ]}
            onPress={stop}
          >
            <Ionicons name="stop" size={24} color="#fff" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { transform: [{ scale: 1.05 }] },
            ]}
            onPress={recordLap}
          >
            <Ionicons name="flag" size={24} color="#fff" />
          </Pressable>
        </View>

        {/* Lap List */}
        <ScrollView style={styles.lapsContainer}>
          <Pressable style={styles.clearButton} onPress={clearLaps}>
            <Text style={styles.clearButtonText}>Clear Laps</Text>
          </Pressable>
          {laps.map((lap, index) => (
            <View
              key={index}
              style={[
                styles.lapItem,
                { backgroundColor: index % 2 === 0 ? '#222222' : '#333333' },
              ]}
            >
              <Text style={styles.lapText}>
                Lap {index + 1}: {formatTime(lap)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#121212', // Dark theme background
  },
  timerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  timer: {
    fontSize: 64,
    fontWeight: '600',
    color: '#fff', // White timer text
    textAlign: 'center',
    fontFamily: 'monospace',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lapsContainer: {
    width: '100%',
  },
  clearButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  lapItem: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  lapText: {
    fontSize: 16,
    color: '#ffffff',
  },
});