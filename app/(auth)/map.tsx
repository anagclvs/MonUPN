import React, {useEffect} from 'react';
import MapView, { PROVIDER_GOOGLE} from 'react-native-maps';
import { StyleSheet,  View } from 'react-native';
import * as Location from 'expo-location';


const INITIAL_REGION = {
    latitude: 48.90401700326009,
    longitude: 2.2125823617569647,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
};
const Maps = () => {

    useEffect( () => {
        (async() => {
            await Location.requestForegroundPermissionsAsync();
        })();
    },[]);


    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={styles.map}
                initialRegion={INITIAL_REGION}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                zoomEnabled={true}
                rotateEnabled={true}
                />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

export default Maps;