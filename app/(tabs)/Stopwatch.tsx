import React, { useState, useEffect, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  FlatList,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function StopwatchScreen() {
  // State for stopwatch functionality
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const [theme, setTheme] = useState('dark'); // Theme state: 'dark' or 'light'
  const animationFrameId = useRef(null);
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Load laps from storage on mount
  useEffect(() => {
    const loadLaps = async () => {
      try {
        const lapsJson = await AsyncStorage.getItem('laps');
        if (lapsJson) setLaps(JSON.parse(lapsJson));
      } catch (error) {
        console.error('Error loading laps:', error);
        ToastAndroid.show('Failed to load laps', ToastAndroid.SHORT);
      }
    };
    loadLaps();
  }, []);

  // Save laps to storage when they change
  useEffect(() => {
    const saveLaps = async () => {
      try {
        await AsyncStorage.setItem('laps', JSON.stringify(laps));
      } catch (error) {
        console.error('Error saving laps:', error);
        ToastAndroid.show('Failed to save laps', ToastAndroid.SHORT);
      }
    };
    saveLaps();
  }, [laps]);

  // Update timer smoothly when running
  useEffect(() => {
    if (isRunning) {
      const updateTimer = () => {
        setCurrentTime(accumulatedTime + (Date.now() - startTime));
        animationFrameId.current = requestAnimationFrame(updateTimer);
      };
      animationFrameId.current = requestAnimationFrame(updateTimer);
    }
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isRunning, accumulatedTime, startTime]);

  // Button press animation
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 50, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // Stopwatch control functions
  const start = () => {
    if (!isRunning) {
      setStartTime(Date.now());
      setIsRunning(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateButton();
    }
  };

  const pause = () => {
    if (isRunning) {
      setAccumulatedTime(accumulatedTime + (Date.now() - startTime));
      setIsRunning(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateButton();
    }
  };

  const reset = () => {
    setIsRunning(false);
    setAccumulatedTime(0);
    setCurrentTime(0);
    setLaps([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animateButton();
  };

  const recordLap = () => {
    if (isRunning) {
      setLaps([...laps, currentTime]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateButton();
    }
  };

  const deleteLap = (index) => {
    setLaps(laps.filter((_, i) => i !== index));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const clearLaps = () => {
    Alert.alert(
      'Clear All Laps',
      'Are you sure you want to delete all laps?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => setLaps([]), style: 'destructive' },
      ]
    );
  };

  // Theme toggle function
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Format time for display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  // Define theme styles
  const getThemeStyles = () => {
    return theme === 'dark'
      ? {
          backgroundColors: ['#1a1a1a', '#121212'], // Dark gradient background
          timerColor: '#fff', // White text for dark mode
          buttonColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white buttons
          accentColor: '#00aaff', // Light blue accent
          lapBackground: 'rgba(30, 30, 30, 0.7)', // Dark lap item background
        }
      : {
          backgroundColors: ['#f5f5f5', '#f5f5f5'], // Solid light gray background
          timerColor: '#333', // Dark gray text for light mode
          buttonColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent black buttons
          accentColor: '#007aff', // Blue accent
          lapBackground: 'rgba(0, 0, 0, 0.05)', // Light lap item background
        };
  };

  const themeStyles = getThemeStyles();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={themeStyles.backgroundColors}
        style={styles.background}
      />
      <View style={styles.mainContainer}>
        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Text
            style={[styles.timer, { color: themeStyles.timerColor }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
          >
            {formatTime(currentTime)}
          </Text>
        </View>

        {/* Control Buttons */}
        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
          {/* Start Button - Green Icon */}
          <Pressable style={[styles.button, styles.startButton]} onPress={start}>
            <Ionicons name="play" size={28} color="#4CAF50" /> {/* Green */}
            <Text style={[styles.buttonLabel, { color: themeStyles.timerColor }]}>Start</Text>
          </Pressable>

          {/* Pause Button - White Icon */}
          <Pressable style={[styles.button, styles.pauseButton]} onPress={pause}>
            <Ionicons name="pause" size={28} color="#FFFFFF" /> {/* White */}
            <Text style={[styles.buttonLabel, { color: themeStyles.timerColor }]}>Pause</Text>
          </Pressable>

          {/* Reset Button - Red Icon */}
          <Pressable style={[styles.button, styles.resetButton]} onPress={reset}>
            <Ionicons name="refresh" size={28} color="#ff4d4d" /> {/* Red */}
            <Text style={[styles.buttonLabel, { color: themeStyles.timerColor }]}>Reset</Text>
          </Pressable>

          {/* Lap Button - Clear Background */}
          <Pressable style={[styles.button, styles.lapButton]} onPress={recordLap}>
            <Ionicons name="flag" size={28} color={themeStyles.accentColor} />
            <Text style={[styles.buttonLabel, { color: themeStyles.timerColor }]}>Lap</Text>
          </Pressable>
        </Animated.View>

        {/* Lap List */}
        <FlatList
          data={laps}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.lapItem,
                { backgroundColor: themeStyles.lapBackground },
              ]}
            >
              <Text style={[styles.lapText, { color: themeStyles.timerColor }]}>
                Lap {index + 1}: {formatTime(item)}
              </Text>
              <Pressable onPress={() => deleteLap(index)}>
                <Ionicons name="trash" size={20} color="#ff4d4d" />
              </Pressable>
            </View>
          )}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Pressable style={styles.clearButton} onPress={clearLaps}>
                <Text style={styles.clearButtonText}>Clear Laps</Text>
              </Pressable>
              <Pressable
                style={[styles.themeButton, { backgroundColor: themeStyles.buttonColor }]}
                onPress={toggleTheme}
                accessibilityLabel={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <Ionicons
                  name={theme === 'dark' ? 'sunny' : 'moon'} // Sun for dark mode, moon for light mode
                  size={20}
                  color={themeStyles.accentColor}
                />
              </Pressable>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  mainContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  timer: {
    fontSize: 80,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  startButton: {
    // Specific styles for start button (if needed)
  },
  pauseButton: {
    // Specific styles for pause button (if needed)
  },
  resetButton: {
    // Specific styles for reset button (if needed)
  },
  lapButton: {
    backgroundColor: 'transparent', // Clear background
  },
  buttonLabel: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: '600',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: 'rgba(255, 77, 77, 0.8)',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  themeButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginVertical: 4,
    width: '100%',
  },
  lapText: {
    fontSize: 16,
    fontWeight: '500',
  },
});