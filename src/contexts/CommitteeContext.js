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

    function initialize() {
        // pull data from database
        
        axios.get(`${API_URL}/committee/${userData.committee_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': currentUser,
            }
        }).then((res) => {
            // set into session
            let countries = res.data.countries;
            let statistics = {
                mod_no: res.data.statistics.mod_no,
                mod_minutes: res.data.statistics.mod_minutes,
                unmod_no: res.data.statistics.unmod_no,
                unmod_minutes: res.data.statistics.unmod_minutes,
                primary_no: res.data.statistics.primary_no,
                primary_minutes: res.data.statistics.primary_minutes,
                secondary_no: res.data.statistics.secondary_no,
                secondary_minutes: res.data.statistics.secondary_minutes
            };

            sessionStorage.setItem('countries', JSON.stringify(countries));
            sessionStorage.setItem('statistics', JSON.stringify(statistics));

        }).catch((err) => {
            console.log(err);
        });

        return {
            countries: getCountries(),
            statistics: getStatistics()
        }
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

    function destroy(data) {
        // destroy from session

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
    }

    return (
        <CommitteeContext.Provider value={value}>
            {children}
        </CommitteeContext.Provider>
    )
}