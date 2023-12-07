import React, {useEffect, useRef, useState} from 'react';
import {Animated, PanResponder, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as Notifications from 'expo-notifications';

// @ts-ignore
const PomodoroTimer = () => {
    const [FOCUS_TIME, setFocusTime] = useState(25 * 60);
    const [BREAK_TIME, setBreakTime] = useState(5 * 60);
    const [time, setTime] = useState(FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    const [timerMode, setTimerMode] = useState("FOCUS");

    const pan = useRef(new Animated.Value(0)).current;
    const swipeOpacity = useRef(new Animated.Value(1)).current;


    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 50,
            onPanResponderMove: (_, gestureState) => {
                pan.setValue(gestureState.dx);
            },
            onPanResponderRelease: (_, gestureState) => {

                if (gestureState.dx > 50 || gestureState.dx < -50) {
                    setBreakTime(prevBreakTime => {
                        return prevBreakTime === 5 * 60 ? 10 * 60 : 5 * 60;
                    });

                    setFocusTime(prevFocusTime => {
                        const newFocusTime = prevFocusTime === 25 * 60 ? 50 * 60 : 25 * 60;
                        setTime(newFocusTime); // Assurez-vous de mettre à jour time ici
                        return newFocusTime;
                    });
                }

                // Reset the pan value
                Animated.spring(pan, {
                    toValue: 0,
                    useNativeDriver: false,
                }).start();
            },

        })
    ).current;

    useEffect(() => {
        let animationCounter = 0;

        const swipeAnimation = () => {
            if (animationCounter < 3) {
                Animated.sequence([
                    Animated.timing(pan, {
                        toValue: 50,
                        duration: 750, // Adjust the duration to control the speed
                        useNativeDriver: false,
                    }),
                    Animated.timing(pan, {
                        toValue: 0,
                        duration: 750, // Adjust the duration to control the speed
                        useNativeDriver: false,
                    }),
                ]).start(() => {
                    animationCounter++;
                    // Start the swipe animation again after a delay of 3 seconds
                    setTimeout(() => {
                        swipeAnimation();
                    }, 1000);
                });
            } else {
                // Fade out the "Swipe" element after the final animation
                Animated.timing(swipeOpacity, {
                    toValue: 0,
                    duration: 500, // Adjust the duration to control the speed of fading out
                    useNativeDriver: false,
                }).start();
            }
        };

        // Start the initial swipe animation
        swipeAnimation();

        return () => {
            // Cleanup animation on component unmount
            pan.setValue(0);
            swipeOpacity.setValue(1);
            // @ts-ignore
            Animated.timing(pan).stop();
        };
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const showNotification = async () => {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Pomodoro Timer',
                    body: timerMode === 'FOCUS' ? 'Focus session is over!' : 'Break time is over!',
                },
                trigger: { seconds: 2 },
            });
        };

        if (isActive && time > 0) {
            timer = setInterval(() => {
                setTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
            }, 1000);
        } else if (isActive && time === 0) {
            // Timer reached 0, switch to break or focus mode
            setIsActive(false);
            showNotification();
            setTimerMode(prevMode => {
                const newMode = prevMode === "FOCUS" ? "BREAK" : "FOCUS";
                setTime(newMode === "FOCUS" ? FOCUS_TIME : BREAK_TIME);
                setIsActive(true);
                return newMode;
            });
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
        setTime(FOCUS_TIME);
        setIsActive(false);
        setTimerMode("FOCUS");
    };

    // @ts-ignore
    return (
        <View style={styles.container}>
            <View style={styles.timerContainer}>
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[styles.swipeContainer, { transform: [{ translateX: pan }] }]}
                >
                    <Animated.Text style={[styles.swipeText, { opacity: swipeOpacity }]}>
                        Swipe to change
                    </Animated.Text>
                    <Text
                        style={[
                            styles.timer,
                            timerMode === 'FOCUS' ? styles.focusTimer : styles.breakTimer,
                        ]}
                    >
                        {formatTime(time)}
                    </Text>
                </Animated.View>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleStartStop}>
                    <Text style={styles.buttonText}>
                        {isActive ? 'Stop' : 'Start'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleReset}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>

            <Text
                style={[
                    styles.timerModeStyle,
                    timerMode === 'FOCUS' ? styles.focusTimer : styles.breakTimer,
                ]}
            >
                {timerMode}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5', // Light background color
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    swipeContainer: {
        position: 'relative',
    },
    timer: {
        fontSize: 40,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    focusTimer: {
        color: '#808080', // Green color for focus mode
    },
    breakTimer: {
        color: '#e91e63', // Pink color for break mode
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    button: {
        marginHorizontal: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: '#DDDDDD', // Blue color for buttons
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'black', // White color for button text
    },
    swipeText: {
        position: 'absolute',
        left: 5,
        top: -35,
        fontSize: 16,
        color: '#757575', // Gray color for swipe text
    },
    timerModeStyle: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#555', // Dark gray color for timer mode text
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
