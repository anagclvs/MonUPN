import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-expo';

const Profile = () => {
  const { user } = useUser();
  // @ts-ignore
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);

  const onSaveUser = async () => {
    try {
      // This is not working!
      const result = await user.update({
        firstName,
        lastName,
      });
      console.log('🚀 ~ file: profile.tsx:16 ~ onSaveUser ~ result:', result);
    } catch (e) {
      console.log('🚀 ~ file: profile.tsx:18 ~ onSaveUser ~ e', JSON.stringify(e));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center' }}>
        Modifier votre profil
      </Text>

      <TextInput placeholder="Prenom" value={firstName} onChangeText={setFirstName} style={styles.inputField}></TextInput>
      <TextInput autoCapitalize={"characters"} placeholder="Nom" value={lastName} onChangeText={setLastName} style={styles.inputField}></TextInput>
      <Button onPress={onSaveUser} title="Enregister" color={'#6c47ff'}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: '#6c47ff',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default Profile;
