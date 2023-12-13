import React, { useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons'; // ensure you have expo vector icons installed

const INITIAL_REGION = {
    latitude: 48.90401700326009,
    longitude: 2.2125823617569647,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
};

const MARKERS = [
    { latitude: 48.90429893249228, longitude: 2.2100637476729825, title: 'Ginouvès', type: 'bat' },
    { latitude: 48.90371184402064, longitude: 2.21046224063483, title: 'Rémond', type: 'bat' },
    { latitude: 48.9031158820423, longitude: 2.2107801509851828, title: 'Grappin', type: 'bat' },
    { latitude: 48.902861428608674, longitude: 2.2115998879362855, title: 'Zazzo', type: 'bat' },
    { latitude: 48.90221115291191, longitude: 2.2120021655467657, title: 'Lefebvre', type: 'bat' },
    { latitude: 48.902211152910816, longitude: 2.2123698669893717, title: 'Rouch', type: 'bat' },
    { latitude: 48.90187187478343, longitude: 2.212697087522359, title: 'Ramnoux', type: 'bat' },
    { latitude: 48.90247003675287, longitude: 2.214769212909768, title: 'Vieil', type: 'bat' },
    { latitude: 48.902200282596894, longitude: 2.21530513647748, title: 'Delbo', type: 'bat' },
    { latitude: 48.90305067763698, longitude: 2.2157670072657085, title: 'Allais', type: 'bat' },
    { latitude: 48.90251061076915, longitude: 2.2161756947716205, title: 'Formation Continue', type: 'bat' },
    { latitude: 48.90277538465416, longitude: 2.216808040601079, title: 'Omnisport', type: 'sport' },
    { latitude: 48.903081427793495, longitude: 2.2172452517160326, title: 'Ephemère 1', type: 'ephem' },
    { latitude: 48.90317984926027, longitude: 2.217907685633829, title: 'Gymnase', type: 'sport' },
    { latitude: 48.90386826237194, longitude: 2.217383491848549, title: 'Ricoeur', type: 'bat' },
    { latitude: 48.90428485215157, longitude: 2.216744441886075, title: 'Resto U', type: 'resto' },
    { latitude: 48.90533672589725, longitude: 2.2156511911255485, title: 'BU', type: 'bu' },
    { latitude: 48.90512291296408, longitude: 2.2146306157692117, title: 'Ephemère 2', type: 'ephem' },
    { latitude: 48.90491404029478, longitude: 2.2134092790362505, title: 'Milliat', type: 'bat' },
    { latitude: 48.90443577582872, longitude: 2.212480692842075, title: 'Maier', type: 'bat' },
    { latitude: 48.904134767873146, longitude: 2.2121626838665964, title: 'Terrasse', type: 'resto' },
    { latitude: 48.90394078400892, longitude: 2.2115851795763963, title: 'Weber', type: 'bat' },
    { latitude: 48.90400905029374, longitude: 2.213169118054205, title: 'Centre sportif', type: 'sport' },
    { latitude: 48.902629113531475, longitude: 2.2134935909870608, title: 'Maison de l’étudiant-e', type: 'etudiant' },
    { latitude: 48.90581446004469, longitude: 2.214062944578656, title: 'Résidence U', type: 'etudiant' },
    // ... Add more markers as needed
];

const Maps = () => {
    const [mapType, setMapType] = useState('satellite'); // satellite view by default
    const [showMarkers, setShowMarkers] = useState(false);

    useEffect(() => {
        (async () => {
            await Location.requestForegroundPermissionsAsync();
        })();
    }, []);

    const toggleMapType = () => {
        setMapType(currentType => (currentType === 'standard' ? 'satellite' : 'standard'));
    };

    const toggleMarkers = () => {
        setShowMarkers(!showMarkers);
    };

    const getMarkerStyle = (type: string) => {
        switch (type) {
            case 'bat':
                return styles.defaultMarker;
            case 'sport':
                return styles.sportMarker;
            case 'resto':
                return styles.restoMarker;
            case 'ephem':
                return styles.ephemMarker;
            case 'etudiant':
                return styles.etudiantMarker;
            default:
                return styles.defaultMarker;
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={INITIAL_REGION}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                zoomEnabled={true}
                rotateEnabled={true}
                mapType={mapType} // use state for mapType
            >
                {showMarkers && MARKERS.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        <View >
                            <Text style={[styles.markerText,getMarkerStyle(marker.type)]}>{marker.title}</Text>
                        </View>
                    </Marker>
                ))}
            </MapView>
            <TouchableOpacity style={styles.button} onPress={toggleMapType}>
                <MaterialIcons name="layers" size={24} color="#666666" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSee]} onPress={toggleMarkers}>
                <MaterialIcons name={showMarkers ? 'visibility' : 'visibility-off'} size={24} color="#666666" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    button: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    buttonSee:{
        top:60
    },
    markerText: {
        fontWeight: 'bold',
        fontSize: 12, // Taille de texte réduite
    },
    markerBase: {
        padding: 6, // Réduction de la taille du label
        borderRadius: 50,
        elevation: 2,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    sportMarker: {
        color: 'rgba(135, 206, 235, 1)', // Bleu pastel plus visible
    },
    restoMarker: {
        color: 'rgb(255,226,192)', // Rose pastel plus visible
    },
    ephemMarker: {
        color: 'rgba(211, 211, 211, 1)', // Gris pastel plus visible
    },
    etudiantMarker: {
        color: 'rgb(119,153,124)', // Bleu-gris pastel plus visible
    },
    defaultMarker: {
        color: 'rgba(255, 182, 193, 1)', // Rouge pastel plus visible
    },
});

export default Maps;