import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <StatusBar style="light" backgroundColor="#121212" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#121212',
            borderTopColor: '#333',
            justifyContent: 'center', // Center content horizontally
            alignItems: 'center', // Center content vertically
            paddingHorizontal: 70, // Add padding to push tabs toward center
            paddingBottom: 5,
            height: 60, // Ensure enough height
          },
          tabBarItemStyle: {
            flex: 1,
            justifyContent: 'center', // Center the tab items
          },
          tabBarActiveTintColor: '#0a7ea4',
          tabBarInactiveTintColor: '#888',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarButton: () => null, // Keep this hidden
          }}
        />
        <Tabs.Screen
          name="Stopwatch"
          options={{
            title: 'Stopwatch',
            tabBarIcon: ({ color }) => <MaterialIcons name="timer" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: 'About',
            tabBarIcon: ({ color }) => <MaterialIcons name="info" size={28} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}