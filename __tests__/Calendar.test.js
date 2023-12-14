// Calendar.test.js

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import Calendar from '../app/(auth)/calendar'; // Adjust the import path
import 'react-native';
import expect from "expect";
import ical from 'ical.js';
// Mocking external dependencies
jest.mock('react-native-calendars', () => ({
    Agenda: 'Agenda',
}));
jest.mock('ical.js', () => ({
    parse: jest.fn(),
    Component: jest.fn(),
    Event: jest.fn(),
}));
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        text: () => Promise.resolve('Mocked response text'),
    })
);

describe('Calendar Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByPlaceholderText } = render(<Calendar />);
        expect(getByPlaceholderText('Enter Calendar URL')).toBeTruthy();
    });

    it('handles URL input and button press', async () => {
        const { getByPlaceholderText, getByText } = render(<Calendar />);

        act(() => {
            fireEvent.changeText(getByPlaceholderText('Enter Calendar URL'), 'https://ade.parisnanterre.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?data=e8bc9d64d64e683e741f185c46fb88d11c189d41b00373c599e0bd1e37f2c34657d58ab4c63f8fe92968762d8416ed8d8ddf862f2f96a2054bb5f92ffe7d2126,1')
        });

        await act(async () => {
            fireEvent.press(getByText('Load Calendar'));
        });

        // Check if the fetch was called
        expect(fetch).toHaveBeenCalledWith('https://ade.parisnanterre.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?data=e8bc9d64d64e683e741f185c46fb88d11c189d41b00373c599e0bd1e37f2c34657d58ab4c63f8fe92968762d8416ed8d8ddf862f2f96a2054bb5f92ffe7d2126,1');
        // Additional assertions can be made here
    });

    // Add more tests for rendering agenda items, error handling, etc.
});
