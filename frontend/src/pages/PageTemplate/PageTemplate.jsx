import React from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import './PageTemplate.css';
import { useState, useEffect } from 'react';

// eslint-disable-next-line no-unused-vars
export const PageTemplate = ({ MainComponent }) => {
    const [, setLocation] = useState({ latitude: null, longitude: null });

    useEffect(() => {
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        setLocation(JSON.parse(savedLocation)); 
      }

      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
      });
    }, []);
    return (
        <div className="page">
            <Header className="header" />
            <main className="main">
                <MainComponent />
            </main>
            <Footer className="footer" />
        </div>
    );
};
