import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

export const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color={'#fff'} />
    </Pressable>
  );
};

const TabsPage = () => {
  const { isSignedIn } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6c47ff',
        },
        headerTintColor: '#fff',
      }}>
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: 'Accueil',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          tabBarLabel: 'Accueil',
        }}
        redirect={!isSignedIn}
      />
        <Tabs.Screen
            name="map"
            options={{
                headerTitle: 'Carte',
                tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} />,
                tabBarLabel: 'Carte',
            }}
            redirect={!isSignedIn}
        />
        <Tabs.Screen
            name="pomodorotool"
            options={{
                headerTitle: 'Pomodoro Timer',
                tabBarIcon: ({ color, size }) => <Ionicons name="timer" size={size} color={color} />,
                tabBarLabel: 'Outils',
            }}
            redirect={!isSignedIn}
        />
        <Tabs.Screen
            name="profile"
            options={{
                headerTitle: 'Mon Profil',
                tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
                tabBarLabel: 'Mon Profil',
                headerRight: () => <LogoutButton />,
            }}
            redirect={!isSignedIn}
        />
    </Tabs>
  );
};

export default TabsPage;
