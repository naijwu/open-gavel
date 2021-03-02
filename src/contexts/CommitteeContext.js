import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { createContext } from 'react';
import { API_URL } from '../config';
import { useAuthContext } from '../authentication/AuthContext';

const CommitteeContext = createContext();

export function useCommitteeContext() {
    return useContext(CommitteeContext);
}

export function CommitteeProvider({ children }) {

    const { currentUser, getTokenData } = useAuthContext();
    const userData = getTokenData();

    function initialize(data) {
        // pull data from database
        sessionStorage.setItem('countries', JSON.stringify(data.countries));
        sessionStorage.setItem('statistics', JSON.stringify(data.statistics));
        sessionStorage.setItem('pushNext', 'false');
    }

    function save(data) {
        // upload to db

    }

    function persist(data) {
        // update to session

        // Data: receive payload of 'Committee' object (contains map of objects 'statistics' and 'countries'
        
        axios.post(`${API_URL}/committee/${userData.committee_id}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': currentUser,
            }
        }).then((res) => {
            
            return;
        }).catch((err) => {
            console.log(err);
        });

    }

    function setPushNext(data) {
        sessionStorage.setItem('pushNext', data);
    }

    function getPushNext() {
        return sessionStorage.getItem('pushNext');
    }

    function destroy() {
        // destroy from session -- called when log-out

        sessionStorage.removeItem('countries');
        sessionStorage.removeItem('statistics');
        sessionStorage.removeItem('pushNext');
    }

    function getCountries() {
        // returns committeeCountries
        let sorted_countries = JSON.parse(sessionStorage.getItem('countries'))
        return sorted_countries.sort((a, b) => (a.name > b.name) ? 1 : -1);
    }

    function getStatistics() {
        // returns statistics

        return JSON.parse(sessionStorage.getItem('statistics'));
    }

    function setCountries(data) {
        sessionStorage.setItem('countries', JSON.stringify(data));
    }

    function setStatistics(data) {
        sessionStorage.setItem('statistics', JSON.stringify(data));
    }

    const value = {
        initialize,
        save,
        persist,
        destroy,

        getCountries,
        setCountries,
        getStatistics,
        setStatistics,

        setPushNext,
        getPushNext,
    }

    return (
        <CommitteeContext.Provider value={value}>
            {children}
        </CommitteeContext.Provider>
    )
}