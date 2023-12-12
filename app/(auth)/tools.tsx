import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ToolsPage = () => {
  const navigation = useNavigation();

  const squaresData = [
    { title: 'Pomodoro Timer', icon: <Ionicons name="timer" style={styles.icon}/>, screen: 'pomodorotool' },
    { title: 'Carte', icon: <Ionicons name="map" style={styles.icon}/>, screen: 'map' },
    { title: 'To-do List', icon: <Ionicons name="list" style={styles.icon}/>, screen: 'todolist' },

    // Add more squares as needed
  ];

  const handleSquarePress = (screen: string) => {
    // Navigate to the specified screen
    // @ts-ignore
    navigation.navigate(screen);
  };

  return (
      <View style={styles.container}>
        {squaresData.map((square, index) => (
            <TouchableOpacity
                key={index}
                style={styles.square}
                onPress={() => handleSquarePress(square.screen)}
            >
              <LinearGradient
                  colors={['#FF0000', '#FF4500']} // Gradient colors (red to dark red)
                  style={styles.gradient}
              >
                <Text style={styles.title}>{square.title}</Text>
                <Text style={styles.icon}>{square.icon}</Text>
              </LinearGradient>
            </TouchableOpacity>
        ))}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
  },
  square: {
    width: '45%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 8,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  icon: {
    fontSize: 24,
    marginTop: 8,
    color: 'white',
  },
});

export default ToolsPage;
