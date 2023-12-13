import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import PomodoroTimer from '../app/(auth)/pomodorotool';
import {act} from "react-dom/test-utils";
import expect from "expect";
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('PomodoroTimer', () => {

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


});