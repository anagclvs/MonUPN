import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import Register from '../app/(public)/register';
import expect from "expect";
import {useSignUp} from "@clerk/clerk-expo"; // Adjust the import path

// Mocking Clerk and other dependencies
jest.mock('@clerk/clerk-expo', () => ({
    useSignUp: () => ({
        isLoaded: true,
        signUp: {
            create: jest.fn().mockResolvedValue({}),
            prepareEmailAddressVerification: jest.fn().mockResolvedValue({}),
            attemptEmailAddressVerification: jest.fn().mockResolvedValue({ createdSessionId: 'mock-session-id' }),
        },
        setActive: jest.fn(),
    }),
}));
jest.mock('react-native-loading-spinner-overlay', () => 'Spinner');
jest.mock('expo-router', () => ({
    Stack: {
        Screen: jest.fn(),
    },
}));

describe('Register Component', () => {
    it('renders correctly with initial state', () => {
        const { getByPlaceholderText } = render(<Register />);
        expect(getByPlaceholderText('Prénom')).toBeTruthy();
        // ...other initial state checks...
    });

    it('updates state on text input change', () => {
        const { getByPlaceholderText } = render(<Register />);
        fireEvent.changeText(getByPlaceholderText('Prénom'), 'John');
        // ...assert state is updated (may need to check internal component state)...
    });

    it('handles sign-up process', async () => {
        const { getByPlaceholderText, getByText } = render(<Register />);
        fireEvent.changeText(getByPlaceholderText('Prénom'), 'John');
        // ...other input changes...
        await act(async () => {
            fireEvent.press(getByText("S'inscrire"));
        });
        // ...assert sign-up process is triggered...
    });

    // Additional tests as needed
});
