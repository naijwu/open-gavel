import React from "react";
import { loadStripe }  from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm"
import Navigation from "./components/Navigation.js";

const promise = loadStripe("pk_test_51G6WxqGdNKtofFw2p4pKuxr7ZnME1vOuKp3YoqxfTcfZW344gNLt3oHoloZWWonRHhCaftpSlYCD2UPSRl7ihBqb00trYkfCZL")

export default function CheckoutRender(){
    return(
        <>
            <Navigation />
        <Elements stripe={promise}>
            <CheckoutForm/>
        </Elements>
        </>
    )
}