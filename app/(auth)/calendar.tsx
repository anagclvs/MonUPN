import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Agenda } from 'react-native-calendars';
// @ts-ignore
import ical from 'ical.js';
import * as SplashScreen from 'expo-splash-screen';

// Mise à jour du type Item pour inclure startTime et endTime
type Item = {
    name: string;
    location: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
};

const Calendar: React.FC = () => {
    const [items, setItems] = useState<{ [key: string]: Item[] }>({});
    const [url, setUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        SplashScreen.preventAutoHideAsync();
    }, []);

    const getData = async () => {
        if (!url) return;

        setLoading(true);
        setItems({});

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseText = await response.text();
            const jcalData = ical.parse(responseText);
            const comp = new ical.Component(jcalData);
            const events = comp.getAllSubcomponents('vevent');

            const mappedItems: { [key: string]: Item[] } = {};

            events.forEach((event: any) => {
                const vevent = new ical.Event(event);

                const startDate = vevent.startDate.toJSDate();
                const endDate = vevent.endDate.toJSDate();

                // Formatage pour obtenir seulement l'heure au format souhaité
                const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
                const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');

                const dateString = startDate.toISOString().split('T')[0];

                const item: Item = {
                    name: vevent.summary,
                    location: vevent.location,
                    description: vevent.description,
                    date: dateString,
                    startTime: startTime,
                    endTime: endTime,
                };

                if (!mappedItems[dateString]) {
                    mappedItems[dateString] = [];
                }

                mappedItems[dateString].push(item);
            });

            setTimeout(() => {
                setItems(mappedItems);
                setUrl('');
            }, 500);
        } catch (error) {
            console.error('Error fetching or parsing data:', error);
        } finally {
            setLoading(false);
            await SplashScreen.hideAsync();
        }
    };


    const renderItem = (item: Item) => {
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemLocation}>{item.location}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemHour}> {item.startTime} - {item.endTime}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setUrl}
                    value={url}
                    placeholder="Enter Calendar URL"
                />
                <Button title="Load Calendar" onPress={getData} disabled={loading} />
            </View>
            <Agenda items={items} renderItem={renderItem} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    inputContainer: {
        padding: 10,
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 10,
    },
    itemContainer: {
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20, // Hauteur de ligne ajustée pour le titre
    },
    itemLocation: {
        fontSize: 14,
        color: '#555',
        lineHeight: 18, // Hauteur de ligne ajustée pour l'emplacement
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18, // Hauteur de ligne ajustée pour la description
    },
    itemHour: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18, // Hauteur de ligne ajustée pour l'heure
    },
});


export default Calendar;
