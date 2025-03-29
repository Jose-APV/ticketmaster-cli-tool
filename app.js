import { select, rawlist } from '@inquirer/prompts';

import { searchEventsByKeyword, getEventDetails } from './api.js';
import { insert, find } from './db.js';
import fs from 'fs';

const saveUniqueItem = (filename, item) => {
    let items = [];
    if (fs.existsSync(filename)) {
        items = JSON.parse(fs.readFileSync(filename));
    }
    if (!items.some(existingItem => existingItem === item)) {
        items.push(item);
        fs.writeFileSync(filename, JSON.stringify(items, null, 2));
    }
}

export const searchAndHandleResults = async (keyword) => {
    try {
        const results = await searchEventsByKeyword(keyword);

        saveUniqueItem('search_history_keyword.json', keyword);

        const displayResults = results.map((result, index) => ({
            name: result.name || `Result ${index + 1}`,
            value: result.id
        }));
        const selectedResultId = await rawlist({
            message: 'Select a search result:',
            choices: displayResults
        });

        saveUniqueItem('search_history_selection.json', selectedResultId);

        const selectedResultDetails = await getEventDetails(selectedResultId);
        console.log('Selected Result Details:', selectedResultDetails);
    } catch (error) {
        console.error('Error during search and handling results:', error);
    }
}


// Keyword history prompts

/**
 * 
 * @param {keyword} keywords 
 * passes the keyword onto the main search function and queries the API once again
 *
 */
const _keywordHistoryPrompt = async (keywords) => {
    const displayKeywords = keywords.map((keyword) => {
        return {name: keyword.keyword, value: keyword.keyword}
    });
    displayKeywords.unshift({ name: 'Exit', value: 'exit' }); // allows exit to be the first option
    return await rawlist({
        message: 'Select a previous keyword to navigate to: ',
        choices: displayKeywords
    });
}

export const keywordHistory = async (args) => {
    // retrieve all keywords
    const keywordCollections = await db.find('search_history_keyword');

    // List prompt all previous keywords
    const keywordSelected = await _keywordHistoryPrompt(keywordCollections);
    if(keywordSelected === 'exit') {
        return;
    }else{
        // redirect user to whatever the user selects
        searchAndHandleResults({keyword: keywordSelected});
    }
}
