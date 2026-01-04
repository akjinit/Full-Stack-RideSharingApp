const axios = require('axios');

module.exports.getAddressCoordinate = async (address) => {
    try {
        const response = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            {
                params: {
                    address,
                    key: process.env.GOOGLE_MAPS_API,
                },
                timeout: 5000,
            }
        );

        if (response.data.status !== "OK") {
            throw new Error(`Unable to fetch coordinates: ${response.data.status}`);
        }

        const location = response.data.results[0].geometry.location;

        return {
            latitude: location.lat,
            longitude: location.lng,
        };
    } catch (err) {
        throw new Error(err.message);
    }
};



module.exports.getDistanceTime = async (origins, destinations) => {
    if (!origins || !destinations) {
        throw new Error('Origin and destination are required');
    }
    const apiKey = process.env.GOOGLE_MAPS_API;

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                origins,
                destinations,
                key: apiKey,
            },
            timeout: 5000,
        });

        if (response.data.status !== "OK") {
            throw new Error(`Unable to fetch distance and time: ${response.data.status}`);
        }

        const element = response.data.rows[0].elements[0];

        if (element.status === "OK") {
            return {
                distance: element.distance.value,
                duration: element.duration.value,
            }
        } else {
            throw new Error(`Unable to fetch distance and time: ${element.status}`);
        }

    } catch (err) {
        console.log(err);
        throw new Error('Unable to fetch distance and time');
    }

};



module.exports.getSuggestions = async (input) => {
    if (!input) {
        throw new Error('Query is required');
    }
    const apiKey = process.env.GOOGLE_MAPS_API;

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
            params: {
                input,
                key: apiKey,
            },
            timeout: 5000,
        });
        if (response.data.status !== "OK") {
            throw new Error(`Unable to fetch suggestions: ${response.data.status}`);
        }
        return response.data.predictions;
    }
    catch (err) {
        throw new Error('Unable to fetch suggestions');
    }
};
