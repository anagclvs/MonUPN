import React from 'react';
import {fireEvent, render, renderHook, waitFor} from '@testing-library/react-native';
import PomodoroTimer from '../app/(auth)/pomodorotool';
import {act} from "react-dom/test-utils";
import expect from "expect";
import panResponder from "react-native-web/src/exports/PanResponder";
import {scheduleNotificationAsync} from "expo-notifications";
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('expo-notifications', () => ({
    scheduleNotificationAsync: jest.fn(),
}));

describe('PomodoroTimer', () => {
    let focusTime = 25 * 60; // 25 minutes in seconds
    let breakTime = 5 * 60; // 5 minutes in seconds
    let time = focusTime; // initial time set to focusTime

// Mock setState functions
    const setFocusTime = jest.fn((callback) => {
        focusTime = callback(focusTime);
        time = focusTime;
    });

    const setBreakTime = jest.fn((callback) => {
        breakTime = callback(breakTime);
    });

    const setTime = jest.fn((newTime) => {
        time = newTime;
    });

    it('renders correctly with initial focus time', () => {
        const { getByText } = render(<PomodoroTimer />);
        expect(getByText('25:00')).toBeTruthy();
        expect(getByText('FOCUS')).toBeTruthy();
    });

    it('starts and stops the timer', async () => {
        jest.useFakeTimers();
        const { getByText, findByText } = render(<PomodoroTimer />);
        const startStopButton = getByText('Start');

        // Start the timer
        await act(async () => {
            fireEvent.press(startStopButton);
            jest.runOnlyPendingTimers();
        });

        await waitFor(() => expect(findByText('Stop')).toBeTruthy());

        // Stop the timer
        await act(async () => {
            fireEvent.press(startStopButton);
            jest.runOnlyPendingTimers();
        });

        await waitFor(() => expect(findByText('Start')).toBeTruthy());

        jest.useRealTimers();
    });


    it('resets the timer', async () => {
        jest.useFakeTimers();
        const { getByText } = render(<PomodoroTimer />);
        const resetButton = getByText('Reset');

        await act(async () => {
            fireEvent.press(resetButton);
            // Fast-forward time for all timers
            jest.runAllTimers();
        });

        expect(getByText('25:00')).toBeTruthy();
        expect(getByText('FOCUS')).toBeTruthy();
        jest.useRealTimers();
    });

    it('counts down the timer correctly', async () => {
        jest.useFakeTimers();
        const { getByText } = render(<PomodoroTimer />);
        const startButton = getByText('Start');

        // Start the timer
        fireEvent.press(startButton);

        // Fast forward a minute
        act(() => {
            jest.advanceTimersByTime(60000);
        });

        await waitFor(() => {
            expect(getByText('24:00')).toBeTruthy(); // Check if the timer has counted down
        });

        jest.useRealTimers();
    });

    it('switches from focus to break after timer ends', async () => {
        jest.useFakeTimers();
        const { getByText, findByText } = render(<PomodoroTimer />);
        const startButton = getByText('Start');

        fireEvent.press(startButton);

        act(() => {
            jest.advanceTimersByTime(25 * 60000); // Fast forward 25 minutes
        });

        await waitFor(() => {
            expect(findByText('BREAK')).toBeTruthy();
        });

        jest.useRealTimers();
    });

});