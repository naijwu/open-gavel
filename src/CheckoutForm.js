import React, { useState, useEffect } from "react"
import axios from 'axios'
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import { API_URL } from './config.js';
import Navigation from "./components/Navigation.js";


const Field = ({
    label,
    id,
    type,
    placeholder,
    required,
    autoComplete,
    value,
    onChange
}) => (
    <div>
        {/*<label htmlFor={id} className="payment-form-label">
            {label}
        </label>*/}
        <input
            className="payment-form-input"
            id={id}
            type={type}
            placeholder={placeholder}
            required={required}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
        />
    </div>
)



export default function Checkout(){

    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('')
    const [billingDetails, setBillingDetails] = useState({
        email: "",
        phone: "",
        name: ""
      });
    
    const stripe = useStripe();
    const elements = useElements();
    
    useEffect(() => {
        //will need to put domain in an env
        window.fetch('http://localhost:8080/donate/payment-intent', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            setClientSecret(data.clientSecret)
        })
    }, [])

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: "antialised",
                fontSize: "16px",
                "::placeholder":{
                    color: "#32325d"
                } 
            },
            invalid: {
                color: "fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    const handleChange = async (event) => {
        setDisabled(event.empty);
        setError(event.error ? event.error.message: "");
    }

    const handleSubmit = async event => {
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: billingDetails
            }
        })

        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);
        }
    };

    return(
        <div className="payment-container">
        <form id="payment-form" onSubmit={handleSubmit}>
            <Field
                id="name"
                type="text"
                placeholder="Name"
                required
                autoComplete="name"
                value={billingDetails.name}
                onChange={(e) => {
                    setBillingDetails({ ...billingDetails, name: e.target.value });
                }}
                />
                <Field
                    id="email"
                    type="text"
                    placeholder="Email"
                    required
                    autoComplete="email"
                    value={billingDetails.email}
                    onChange={(e) => {
                        setBillingDetails({ ...billingDetails, email: e.target.value });
                    }}
                />
                <Field
                    id="phone"
                    type="tel"
                    placeholder="Phone"
                    required
                    autoComplete="Phone"
                    value={billingDetails.phone}
                    onChange={(e) => {
                        setBillingDetails({ ...billingDetails, phone: e.target.value });
                    }}
                />

            <CardElement id="card-element" options={cardStyle} onChange={handleChange}/>

            <button className="pay-button" disabled={processing || disabled || succeeded} id="submit">

                <span id="button-text">
                    {processing ? (
                        <div className="spinner" id="spinner"></div>
                    ): (
                        "Pay Now"
                    )}
                </span>
            </button>
            {error && (
                <div className="card-error" role="alert">
                    {error}
                </div>
            )}
            <p className={succeeded ? "result-message": "result-message hidden"}>
                Payment succeeded!
            </p>
        </form>
        </div>
    )


}