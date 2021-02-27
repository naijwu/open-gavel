import React, { useContext, useState, useEffect } from 'react';
import { createContext } from 'react';

const CommitteeContext = createContext();

export function useCommitteeContext() {
    return useContext(CommitteeContext);
}

export function CommitteeProvider({ children }) {

    // countries to display, country statistics to update
    const [committeeCountries, setCommitteeCountries] = useState([]); 

    // committee-general statistics
    const [statsModerated, setStatsModerated] = useState({});
    const [statsUnmoderated, setStatsUnmoderated] = useState({});
    const [statsPrimary, setStatsPrimary] = useState({});
    const [statsSecondary, setStatsSecondary] = useState({});


    function saveCommitteeCountries() {
        // update committee countries to database

    }

    function saveCommitteeState() {
        // upload committee state to DB -- saved after every speech

    }

    function pullCommitteeCountries() {
        // get committee countries from DB and put into context state

    }

    function pullCommitteeState() {
        // get committee state from DB and put into context state

    }

    function pullCommitteeInfo() {
        // invoke pullCommitteeCountries and pullCommitteeState - called upon Staff Login
    }

    const value = {
        saveCommitteeCountries,
        saveCommitteeState,
        pullCommitteeInfo,
        
        committeeCountries, setCommitteeCountries,
        statsModerated, setStatsModerated,
        statsUnmoderated, setStatsUnmoderated,
        statsPrimary, setStatsPrimary,
        statsSecondary, setStatsSecondary
    }

    return (
        <CommitteeContext.Provider value={value}>
            {children}
        </CommitteeContext.Provider>
    )
}