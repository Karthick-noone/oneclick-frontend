import React, { useState } from 'react';
import axios from 'axios';
import { ApiUrl } from '../../components/ApiUrl';

const ShipmentTracker = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [error, setError] = useState('');

    const handleTrack = async () => {
        console.log('Tracking number entered:', trackingNumber);

        if (!trackingNumber) {
            setError('Please enter a waybill or order ID');
            console.error('Invalid Input: No tracking number provided');
            return;
        }

        try {
            setError('');
            console.log('Sending request to backend API...');
            const response = await axios.get(`${ApiUrl}/track-shipment`, {
                params: { order_id: trackingNumber }, // Pass `order_id` instead of `waybill`
            });
            console.log('Response from backend:', response.data);
            setTrackingData(response.data);
        } catch (err) {
            setError('Unable to fetch tracking information. Please try again.');
            console.error('Error fetching tracking data:', err.message);
        }
    };

    return (
        <div>
            <h2 style={{ marginTop: '90px' }}>Shipment Tracker</h2>
            <input
                style={{ marginLeft: '300px' }}
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter Waybill or Order ID"
            />
            <button onClick={handleTrack}>Track</button>

            {error && <p style={{ color: 'red', marginLeft: '300px' }}>{error}</p>}

            {trackingData && (
                <div>
                    <h3 style={{ marginLeft: '300px' }}>Tracking Information</h3>
                    <pre style={{ marginLeft: '300px' }}>{JSON.stringify(trackingData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default ShipmentTracker;
