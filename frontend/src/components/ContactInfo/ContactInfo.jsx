import React from "react";
import "./ContactInfo.css";

const ContactInfo = () => {
  return (
      <div className="contact-card">
        <p className="title">Address:</p>
        <p>📍 123 Example Street, City, Country</p>

        <p className="title">Phone:</p>
        <p>📞 +40 123 456 789</p>

        <p className="title">Email:</p>
        <p>📧 contact@academiq.com</p>

        <p className="title">Website:</p>
        <p>🌐 www.academiq.com</p>

        <p className="title">Business Hours:</p>
        <p>⏰ Monday - Friday: 09:00 AM - 06:00 PM</p>
        <p>⏰ Saturday - Sunday: Closed</p>
      </div>
  );
};

export default ContactInfo;
