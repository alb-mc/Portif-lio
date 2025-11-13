"use client";

import React from "react";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=5537984119603&text&type=phone_number&app_absent=0";

export const ContactButton: React.FC = () => {
  return (
    <a
      className="contact-button"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact me via WhatsApp"
    >
      <span className="contact-label">Contact Me</span>
    </a>
  );
};

export default ContactButton;
