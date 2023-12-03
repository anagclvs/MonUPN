import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


const PomodoroTimer = () => {
    const initialTime = 25 * 60; // 25 minutes in seconds
    const [time, setTime] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;

        if (isActive && time > 0) {
            timer = setInterval(() => {
                setTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [isActive, time]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleStartStop = () => {
        setIsActive(prevIsActive => !prevIsActive);
    };

    const handleReset = () => {
        setTime(initialTime);
        setIsActive(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.timer}>{formatTime(time)}</Text>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleStartStop}>
                    <Text>{isActive ? 'Stop' : 'Start'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleReset}>
                    <Text>Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timer: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    button: {
        marginHorizontal: 10,
        padding: 10,
        backgroundColor: '#DDDDDD',
        borderRadius: 5,
    },
});
const PomodoroTool = () => {
    return (
        <View style={styles.container}>
            <PomodoroTimer />
        </View>
    );
};

export default PomodoroTool;