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

    // Settings: {
    //     default_start_screen, (dropdown, blank/rollcall/speakers/motions/active-caucus)
    //     hide_all_notifications,
    //     default_drawer_position,
    //     auto_start_speaker_timer,
    //     dark_mode,
    // }

    function initialize(data) {
        // pull data from database
        sessionStorage.setItem('countries', JSON.stringify(data.countries));
        sessionStorage.setItem('statistics', JSON.stringify(data.statistics));
        sessionStorage.setItem('pushNext', 'false');
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
        sessionStorage.removeItem('motions');
    }

    function getCountries() {
        // returns committeeCountries
        let countries = sessionStorage.getItem('countries');
        if(!countries) {
            // null countries -- session storage hasn't exist
            return null;
        } else {
            let sorted_countries = JSON.parse(countries)
            return sorted_countries.sort((a, b) => (a.name > b.name) ? 1 : -1);
        }
    }

    function getStatistics() {
        // returns statistics
        let statistics = sessionStorage.getItem('statistics');
        if(!statistics) {
            // null statistics -- session storage hasn't been set
            return null;
        } else {
            return JSON.parse(statistics);
        }
    }

    function setCountries(data) {
        sessionStorage.setItem('countries', JSON.stringify(data));
    }

    function setStatistics(data) {
        sessionStorage.setItem('statistics', JSON.stringify(data));
    }

    function setMotionsList(data) {
        sessionStorage.setItem('motions', JSON.stringify(data));
    }

    function getMotionsList() {
        let motions = sessionStorage.getItem('motions');
        if(!motions) {
            return null;
        } else {
            return JSON.parse(motions);
        }
    }

    const value = {
        initialize,
        persist,
        destroy,

        getCountries,
        setCountries,
        getStatistics,
        setStatistics,

        getMotionsList,
        setMotionsList,

        setPushNext,
        getPushNext,
    }

    return (
        <CommitteeContext.Provider value={value}>
            {children}
        </CommitteeContext.Provider>
    )
}