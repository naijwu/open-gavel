import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "./authentication/AuthContext";
import { countries } from "./data/Countries";
import { API_URL } from "./config";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import AddCountryModal from "./components/AddCountryModal";
import AddCustomModal from "./components/AddCustomModal";
import { useHistory } from "react-router-dom";
import { useCommitteeContext } from "./contexts/CommitteeContext";
import Flag from "react-flagpack";

// Country Object (For Reference);
// {
//     "name": "Zimbabwe",
//     "country_code": "ZW",
//     "country_flag_base": "...", // base64 of custom delegation flag (field doesnt exist for UN countries)
//     "presence": "",
//     "stats_moderated": 0,
//     "stats_unmoderated": 0,
//     "stats_primary": 0,
//     "stats_secondary": 0
// }

const Preferences = () => {
	const { currentUser, getTokenData } = useAuthContext();
	const {
		initialize,
		getCountries,
		getStatistics,
		setStatistics,
		setCountries,
	} = useCommitteeContext();

	const userData = getTokenData();

	const [loaded, setLoaded] = useState(false);

	// This data should be received from the committee db entry
	const [committeeCountries, setCommitteeCountries] = useState(
		getCountries() ? getCountries() : [],
	); // Countries in the committee (shows up for roll call)
	const [displayCountries, setDisplayCountries] = useState([]); // Perhaps removing via database wouldn't require full reload (but useEffect would refresh the list)
	const [selectedCountries, setSelectedCountries] = useState([]); // Array of country_code of countries selected
	const [selected, setSelected] = useState(""); // Number of countries selected, or false

	// For the "Add UN Countries" modal
	const [availableUNCountries, setAvailableUNCountries] = useState("");
	const [isAddingCountries, setIsAddingCountries] = useState(false);

	// for the "Add Custom Country" modal
	const [isAddingCountry, setIsAddingCountry] = useState(false);

	// Data from DB about statistics
	const [statistics, committeeStatistics] = useState(
		getStatistics() ? getStatistics() : [],
	);

	// For delegate statistics
	const [primaryChecked, setPrimaryChecked] = useState(true);
	const [secondaryChecked, setSecondaryChecked] = useState(true);
	const [caucusChecked, setCaucusChecked] = useState(true);
	const [checked, setChecked] = useState("spc");
	const [displayStatistics, setDisplayStatistics] = useState([]);

	const [refresh, setRefresh] = useState(false);

	const resetEditStates = (all) => {
		setSelectedCountries([]);
		setSelected(false);
		setRefresh(refresh ? false : true);
		if (all) {
			setDisplayCountries([]);
		}
		// history.go(0);
	};

	useEffect(() => {
		axios
			.get(`${API_URL}/committee/${userData.committee_id}`, {
				headers: {
					"Content-Type": "application/json",
					"auth-token": currentUser,
				},
			})
			.then((res) => {
				// set into session
				let countries = res.data.countries;
				let statistics = res.data.statistics;
				let settings = res.data.settings;

				setCommitteeCountries(
					countries.sort((a, b) => (a.name > b.name ? 1 : -1)),
				);
				committeeStatistics(statistics);
				initialize({
					countries: countries,
					statistics: statistics,
					app_settings: settings,
				});
			})
			.catch((err) => {
				console.log(err);
			});

		setLoaded(committeeCountries ? true : "");
	}, [refresh]);

	const handleFilter = (type) => {
		setChecked(
			checked.indexOf(type) > -1 ? checked.replace(type, "") : checked + type,
		);
		switch (type) {
			case "p":
				return setPrimaryChecked(checked.indexOf(type) > -1 ? false : true);
			case "s":
				return setSecondaryChecked(checked.indexOf(type) > -1 ? false : true);
			case "c":
				return setCaucusChecked(checked.indexOf(type) > -1 ? false : true);
		}
	};

	const toggleCountrySelect = (_id) => {
		let countries = selectedCountries;

		if (countries.indexOf(_id) > -1) {
			// already selected -- remove (like toggle)
			countries.splice(countries.indexOf(_id), 1);

			let selected = document.getElementsByClassName(_id);
			selected[0].classList.remove("selected");
		} else {
			// not selected -- add
			countries.push(_id);

			let selected = document.getElementsByClassName(_id);
			selected[0].classList.add("selected");
		}
		setSelectedCountries(countries);
	};

	const handleCountrySelect = (_id) => {
		// TODO: perhaps make Shift Click for toggling in-between country selections

		toggleCountrySelect(_id);

		// not sure why, but selectedcountries.length alone cannot be used in ternary operator for conditional rendering
		if (selectedCountries.length > 0) {
			setSelected(selectedCountries.length);
		} else {
			setSelected(false);
		}
	};

	const clearSelected = () => {
		for (let i = 0; i < selectedCountries.length; i++) {
			let selected = document.getElementsByClassName(selectedCountries[i]);
			selected[0].classList.remove("selected");
		}
		let countries = selectedCountries;
		setSelected(false);
		setSelectedCountries(countries.splice(0, countries.length));
	};

	const handleAddUNCountries = (e) => {
		// opening the modal, passing through required information

		const availableCountries = countries.filter((el) => {
			return !committeeCountries.some((f) => {
				return f.name === el.name;
			});
		});

		setAvailableUNCountries(availableCountries);
		clearSelected();
		setIsAddingCountries(true);
	};

	const handleSubmitUNCountries = (countries) => {
		// This function is invoked from the Modal (AddCountryModal) to add the countries selected -- should return an array of country objects (see above)

		// countries == countries to add
		let newCountries = committeeCountries;

		for (let i = 0; i < countries.length; i++) {
			newCountries.push(countries[i]);
		}

		let postBody = {
			countries: newCountries,
			statistics: statistics,
		};

		axios
			.post(`${API_URL}/committee/${userData.committee_id}`, postBody, {
				headers: {
					"Content-Type": "application/json",
					"auth-token": currentUser,
				},
			})
			.then((res) => {
				setCountries(postBody.countries);

				setIsAddingCountries(false);
				// history.go(0);
				resetEditStates();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	function handleAddCustomCountry(e) {
		setIsAddingCountry(true);
	}

	function handleSubmitCustomCountry(country) {
		let newCountries = committeeCountries;

		newCountries.push(country);

		let postBody = {
			countries: newCountries,
			statistics: statistics,
		};

		// return console.log(country);

		axios
			.post(`${API_URL}/committee/${userData.committee_id}`, postBody, {
				headers: {
					"Content-Type": "application/json",
					"auth-token": currentUser,
				},
			})
			.then((res) => {
				setCountries(postBody.countries);

				setIsAddingCountries(false);
				resetEditStates();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	const handleRemoveCountries = (e) => {
		// TODO: Have a modal confirmation or something

		const newCountries = committeeCountries.filter((item) => {
			return !selectedCountries.includes(item._id);
		});

		let postBody = {
			countries: newCountries,
			statistics: statistics,
		};

		axios
			.post(`${API_URL}/committee/${userData.committee_id}`, postBody, {
				headers: {
					"Content-Type": "application/json",
					"auth-token": currentUser,
				},
			})
			.then((res) => {
				// history.go(0);
				setCountries(postBody.countries);
				setStatistics(postBody.statistics);

				if (newCountries.length === 0) {
					resetEditStates(true);
				} else {
					resetEditStates(false);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		let displayArr = [];
		let displayArrStatistics = [];

		if (committeeCountries.length === 0) {
			displayArr.push(
				<div className="country-standin">
					Add countries by clicking the buttons below.
				</div>,
			);
		}

		for (let i = 0; i < committeeCountries.length; i++) {
			displayArr.push(
				<div
					className={`country-item ${committeeCountries[i]._id}`}
					onClick={(e) => handleCountrySelect(committeeCountries[i]._id)}
				>
					<div className="checked"></div>
					<p>{committeeCountries[i].name}</p>
					{committeeCountries[i].country_flag_base ? (
						<img
							src={committeeCountries[i].country_flag_base}
							alt={committeeCountries[i].country_flag_base}
						/>
					) : committeeCountries[i].country_code ? (
						<Flag code={committeeCountries[i].country_code} size="m" />
					) : (
						<></>
					)}
				</div>,
			);
		}

		setDisplayCountries(displayArr);
	}, [refresh, committeeCountries]);

	useEffect(() => {
		let displayArrStatistics = [];

		if (committeeCountries.length === 0) {
			displayArrStatistics.push(
				<div className="country-standin">No countries</div>,
			);
		}

		let highestVal = 0;

		for (let i = 0; i < committeeCountries.length; i++) {
			let country = committeeCountries[i];
			let number =
				parseInt(country.stats_moderated) +
				parseInt(country.stats_primary) +
				parseInt(country.stats_secondary);
			if (number > highestVal) {
				highestVal = number;
			}
		}

		for (let i = 0; i < committeeCountries.length; i++) {
			let country = committeeCountries[i];
			displayArrStatistics.push(
				<div className="del-stat-item">
					<div className="del-stat-name">{country.name}</div>
					<div className="del-stat-bar">
						{country.stats_primary ? (
							<div
								className={`stat stat-primary ${checked.includes("p") ? "" : "invisible"}`}
								style={{
									width:
										(parseInt(country.stats_primary) / highestVal) * 100 + "%",
								}}
							>
								<div className="stat-no">{country.stats_primary + "s"}</div>
							</div>
						) : (
							""
						)}
						{country.stats_secondary ? (
							<div
								className={`stat stat-secondary ${checked.includes("s") ? "" : "invisible"}`}
								style={{
									width: (country.stats_secondary / highestVal) * 100 + "%",
								}}
							>
								<div className="stat-no">{country.stats_secondary + "s"}</div>
							</div>
						) : (
							""
						)}
						{country.stats_moderated ? (
							<div
								className={`stat stat-other ${checked.includes("c") ? "" : "invisible"}`}
								style={{
									width: (country.stats_moderated / highestVal) * 100 + "%",
								}}
							>
								<div className="stat-no">{country.stats_moderated + "s"}</div>
							</div>
						) : (
							""
						)}
					</div>
				</div>,
			);
		}
		setDisplayStatistics(displayArrStatistics);
	}, [refresh, committeeCountries, checked]);

	return (
		loaded && (
			<div>
				<Navigation />
				<div
					className={`main preferences modal${isAddingCountries || isAddingCountry}`}
				>
					<div className="container">
						<h1>Committee Dashboard</h1>

						<div className="settings">
							<h2>Committee Information</h2>
							<div className="information-container">
								<div className="left-col">
									<div className="widget basic">
										<div className="big">
											<h3>{userData.committee}</h3>
											<h4>{userData.conference}</h4>
										</div>
										<div className="small">
											<p>
												{committeeCountries.length
													? committeeCountries.length
													: "0"}{" "}
												countries total
											</p>
										</div>
									</div>
								</div>
								<div className="right-main">
									<div className="country-management">
										<div className="country-manage-head">
											<h4>Countries in Committee</h4>
										</div>
										<div className="country-list-container">
											<div
												className={`country-list-wrap display${selected ? true : ""}`}
											>
												<div className="country-list-actions">
													<button
														className="deselect-all"
														onClick={(e) => clearSelected()}
													>
														Deselect All
													</button>
												</div>
												<div className="country-list">{displayCountries}</div>
											</div>
										</div>
										<div className="country-manage-actions">
											<button
												className={`remove-country display${selected ? true : ""}`}
												onClick={handleRemoveCountries}
											>
												Remove Selected ({selectedCountries.length})
											</button>
											<button
												className="add-country un"
												onClick={handleAddUNCountries}
											>
												Add UN Countries
											</button>
											<button
												className="add-country custom"
												onClick={handleAddCustomCountry}
											>
												Add Custom Country
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="statistics">
							<h2>Committee Statistics</h2>
							<div className="information-container">
								<div className="left-col">
									<div className="widget stats">
										<div className="big">
											<h3>{statistics.mod_no ? statistics.mod_no : "0"}</h3>
											<h4>Moderated Caucuses</h4>
										</div>
										<div className="small">
											<p>
												{statistics.mod_seconds
													? (parseInt(statistics.mod_seconds) / 60).toFixed(0) <
														1
														? "< 1"
														: (parseInt(statistics.mod_seconds) / 60).toFixed(0)
													: "0"}{" "}
												minutes total
											</p>
										</div>
									</div>
									<div className="widget stats">
										<div className="big">
											<h3>{statistics.unmod_no ? statistics.unmod_no : "0"}</h3>
											<h4>Unmoderated Caucuses</h4>
										</div>
										<div className="small">
											<p>
												{statistics.unmod_seconds
													? (parseInt(statistics.unmod_seconds) / 60).toFixed(
															0,
														) < 1
														? "< 1"
														: (parseInt(statistics.unmod_seconds) / 60).toFixed(
																0,
															)
													: "0"}{" "}
												minutes total
											</p>
										</div>
									</div>
									<div className="widget stats">
										<div className="big">
											<h3>
												{statistics.roundtable_no
													? statistics.roundtable_no
													: "0"}
											</h3>
											<h4>Round Tables</h4>
										</div>
										<div className="small">
											<p>
												{statistics.roundtable_seconds
													? (
															parseInt(statistics.roundtable_seconds) / 60
														).toFixed(0) < 1
														? "< 1"
														: (
																parseInt(statistics.roundtable_seconds) / 60
															).toFixed(0)
													: "0"}{" "}
												minutes total
											</p>
										</div>
									</div>
								</div>
								<div className="right-main">
									<div className="delegate-statistics">
										<div className="del-stat-head">
											<h4>Delegate Statistics</h4>
											<div className="del-stat-selector">
												<div
													className={`selector primary ${primaryChecked}`}
													onClick={(e) => handleFilter("p")}
												>
													<div className="checkmark"></div>
													<p>Primary Speakers'</p>
												</div>
												<div
													className={`selector secondary ${secondaryChecked}`}
													onClick={(e) => handleFilter("s")}
												>
													<div className="checkmark"></div>
													<p>Secondary Speakers'</p>
												</div>
												<div
													className={`selector caucus ${caucusChecked}`}
													onClick={(e) => handleFilter("c")}
												>
													<div className="checkmark"></div>
													<p>Caucuses + Other</p>
												</div>
											</div>
										</div>
										<div className="del-stat-data">{displayStatistics}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Footer />
				{isAddingCountries ? ( // Edits to the secretariat profile (not committee accounts)
					<AddCountryModal
						visible={isAddingCountries}
						visibleFn={setIsAddingCountries}
						countries={availableUNCountries}
						submit={handleSubmitUNCountries}
					/>
				) : (
					""
				)}
				{isAddingCountry ? (
					<AddCustomModal
						visible={isAddingCountry}
						visibleFn={setIsAddingCountry}
						stockCountries={countries}
						committeeCountries={committeeCountries}
						submit={handleSubmitCustomCountry}
					/>
				) : (
					""
				)}
			</div>
		)
	);
};

export default Preferences;
