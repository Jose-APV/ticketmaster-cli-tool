import axios from 'axios';

const ROOT_URL = 'https://app.ticketmaster.com/discovery/v2/events';

//this is our api key for the ticketmaster api, failure to use in the api calls will result in an oauth error
const apikey = 'uhCtjDZYA9fO2B7TVEDJ9ztNvNGyBxDG';

// https://app.ticketmaster.com/discovery/v2/events?apikey={apikey}&keyword={keyword}
// keyword (string) - this is the keyword we will use for searching ticketmaster events

export const searchEventsByKeyword = async (keyword) => {
    try {
        const keywordURL = `${ROOT_URL}?apikey=${apikey}&keyword=${keyword}`;

        const response = await axios.get(keywordURL);

        return response.data;
    }  
    catch (error) {
        throw new error(error.message);
    }

};


// https://app.ticketmaster.com/discovery/v2/events/{id}?apikey={apikey}
// id (string) - this is the id of the event we want more details for

export const getEventDetails = async (id) => {
    try {
        const eventDetailsURL = `${ROOT_URL}/${id}?apikey=${apikey}`;

        const response = await axios.get(eventDetailsURL);

        return response.data;
    } 
    catch (error) {
        throw new error(error.message);
    }
};
