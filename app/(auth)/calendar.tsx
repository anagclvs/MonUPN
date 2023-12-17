import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Modal, TextInput, Button } from 'react-native';
import { Agenda } from 'react-native-calendars';
import ical from 'ical.js';
import * as SplashScreen from 'expo-splash-screen';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import {FIRESTORE_DB} from "../../FirebaseConfig";
import { useUser } from '@clerk/clerk-expo';

const db = FIRESTORE_DB;

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
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const { user } = useUser();
    const numE = user?.id;

    useEffect(() => {
        SplashScreen.preventAutoHideAsync();
        loadUrlFromFirestore();
    }, []);

    useEffect(() => {
        if (url) {
            getData();
        }
    }, [url]);

    const loadUrlFromFirestore = async () => {
        const documentId = `ical${numE}`; // numE changes according to your logic
        const urlRef = doc(db, 'icalUsers', documentId);
        try {
            const docSnap = await getDoc(urlRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUrl(data.url);
            } else {
                console.log('No such document in Firestore!');
            }
        } catch (error) {
            console.error('Error fetching URL from Firestore:', error);
        }
    };

    const saveUrlToFirestore = async (url: string) => {
        const documentId = `ical${numE}`; // numE changes according to your logic
        const urlRef = doc(db, 'icalUsers', documentId);
        try {
            await setDoc(urlRef, { url: url });
        } catch (error) {
            console.error('Error saving URL to Firestore:', error);
        }
    };

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
                const startTime = startDate.toISOString().split('T')[1].substring(0, 5);
                const endTime = endDate.toISOString().split('T')[1].substring(0, 5);
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

            for (let date in mappedItems) {
                mappedItems[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
            }

            setItems(mappedItems);
        } catch (error) {
            console.error('Error fetching or parsing data:', error);
        } finally {
            setLoading(false);
            SplashScreen.hideAsync();
        }
    };

    const renderItem = (item: Item) => {
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemLocation}>{item.location}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemHour}>{item.startTime} - {item.endTime}</Text>
            </View>
        );
    };

    const handleSetUrl = () => {
        setIsModalVisible(false);
        saveUrlToFirestore(url);
        getData();
    };

    return (
        <SafeAreaView style={styles.safe}>
            <Button title="Settings" onPress={() => setIsModalVisible(true)} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setUrl}
                        value={url}
                        placeholder="Enter Calendar URL"
                    />
                    <Button title="Set Calendar URL" onPress={handleSetUrl} />
                </View>
            </Modal>
            <Agenda items={items} renderItem={renderItem} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    modalView: {
        marginTop: 50,
        marginHorizontal: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    input: {
        height: 40,
        width: '100%',
        marginVertical: 12,
        borderWidth: 1,
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
    },
    itemLocation: {
        fontSize: 14,
        color: '#555',
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
    },
    itemHour: {
        fontSize: 14,
        color: '#666',
    },
});

export default Calendar;
