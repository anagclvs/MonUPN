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
            name="tools"
            options={{
                headerTitle: 'Outils',
                tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
                tabBarLabel: 'Outils',
            }}
            redirect={!isSignedIn}
        />
        <Tabs.Screen
            name="calendar"
            options={{
                headerTitle: 'Calendrier',
                tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
                tabBarLabel: 'Calendrier',
                headerRight: () => <LogoutButton />,
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
        <Tabs.Screen
                // Name of the route to hide.
                name="pomodorotool"
                options={{
                    // This tab will no longer show up in the tab bar.
                    href: null,
                }}
            />
        <Tabs.Screen
            // Name of the route to hide.
            name="todolist"
            options={{
                // This tab will no longer show up in the tab bar.
                href: null,
            }}
        />
    </Tabs>
  );
};

export default TabsPage;
