import React, { useState } from 'react';
import axios from 'axios';
import "./Form.css"

const ReservationForm = ({ fetchSeats }) => {
    const [numSeats, setNumSeats] = useState('');
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/reserve', { numSeats });
            setNumSeats('');
            fetchSeats();
        } catch (error) {
            console.error('Failed to reserve seats:', error);
        }
    };
    const handleReset = async () => {
        try {
            await axios.post('/reset');
            alert('Seats reset successfully');
            fetchSeats();
        } catch (error) {
            alert('Failed to reset seats');
        }
    };
    return (
        <>
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter seat numbers"
                        value={numSeats}
                        onChange={(e) => setNumSeats(e.target.value)}
                    />
                </div>
                <div className="button-row">
                    <button type="submit" className="form-button">Reserve</button>
                    <button onClick={handleReset} className="form-button">Reset Seats</button>
                </div>
            </form>

        </>
    );
};

export default ReservationForm;
