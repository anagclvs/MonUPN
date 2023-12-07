import {View, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FIRESTORE_DB} from "../../FirebaseConfig";
import {addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc} from "@firebase/firestore";
import {Entypo, Ionicons} from "@expo/vector-icons";
import { useUser } from '@clerk/clerk-expo';

export interface Todo {
    done: boolean;
    id: string;
    title: string;
}

const List = () => {
    const [todos, setTodos] = useState<any[]>([]);
    const [todo, setTodo] = useState('');
    const { user } = useUser();
    const numE = user?.id;


    useEffect(() => {

        const todoRef = collection(FIRESTORE_DB, `todos${numE}`);

        const subscriber = onSnapshot(todoRef, {
            next: (snapshot) => {
                const todos: any[] = [];
                snapshot.docs.forEach((doc) => {
                    todos.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                setTodos(todos);
            }
        });

        // // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);
    const addTodo = async () => {
        try {
            const docRef = await addDoc(collection(FIRESTORE_DB, `todos${numE}`), {
                title: todo,
                done: false
            });
            setTodo('');
            console.log('Document written with ID: ', docRef.id);
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    };

    const renderTodo = ({ item }: any) => {
        const ref = doc(FIRESTORE_DB, `todos${numE}/${item.id}`);

        const toggleDone = async () => {
            updateDoc(ref, { done: !item.done });
        };

        const deleteItem = async () => {
            deleteDoc(ref);
        };

        return (
            <View style={styles.todoContainer}>
                <TouchableOpacity onPress={toggleDone} style={styles.todo}>
                    {item.done && <Ionicons name="md-checkmark-circle" size={32} color="green" />}
                    {!item.done && <Entypo name="circle" size={32} color="black" />}
                    <Text style={styles.todoText}>{item.title}</Text>
                </TouchableOpacity>
                <Ionicons name="trash-bin-outline" size={24} color="red" onPress={deleteItem} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Add new todo"
                    onChangeText={(text) => setTodo(text)}
                    value={todo}
                />
                <Button onPress={addTodo} title="Add Todo" disabled={todo === ''} />
            </View>

            {todos.length > 0 && (
                <View>
                    <FlatList
                        data={todos}
                        renderItem={renderTodo}
                        keyExtractor={(todo) => todo.id}
                        // removeClippedSubviews={true}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20
    },
    form: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    todo: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    todoText: {
        flex: 1,
        paddingHorizontal: 4
    },
    todoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 4
    }
});

export default List;