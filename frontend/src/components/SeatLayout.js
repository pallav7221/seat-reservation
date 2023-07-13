import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReservationForm from './Form';
import "./SeatLayout.css"

const SeatLayout = () => {
    const [seats, setSeats] = useState([]);
    useEffect(() => {
        fetchSeats();
    }, []);

    const fetchSeats = async () => {
        try {
            const response = await axios.get('/seats');
            setSeats(response.data.seats);
        } catch (error) {
            console.error('Failed to fetch seats:', error);
        }
    };

    return (
        <div className="container">
            <div className="seat-layout">
                <h2>Seat Layout</h2>
                <div className="ticket-container">
                    {seats ? (
                        <div className="seats-container">
                            {seats.map((ticket, index) => (
                                <div
                                    key={index}
                                    className={`ticket ${ticket.isBooked ? 'booked': 'available'}`}
                                >
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>Loading....</div>
                    )}
                </div>
            </div>
            <div className="reservation-form">
                <h2>Book a Ticket</h2>
                <ReservationForm fetchSeats={fetchSeats} />
            </div>
        </div >
    );
};

export default SeatLayout;

