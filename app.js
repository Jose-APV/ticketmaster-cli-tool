import { select, rawlist } from '@inquirer/prompts';

import { searchEventsByKeyword, getEventDetails } from './api';
import db from './db.js';







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
        searchEvent({keyword: keywordSelected});
    }
}