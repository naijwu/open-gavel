import React from "react";
import { loadStripe }  from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm"
import Navigation from "./components/Navigation.js";

//ENV does not work 
const promise = loadStripe("process.env.PUBLIC_STRIPE_KEY")

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