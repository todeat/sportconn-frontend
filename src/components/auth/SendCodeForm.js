import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Phone } from "lucide-react";
import { checkUserExists } from "../../services/api";

const SendCodeForm = ({ onCodeSent }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };


  const setupRecaptcha = () => {
    // Mai întâi curățăm orice instanță existentă
    clearRecaptcha();
    
    // Apoi creăm una nouă
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {
        console.log("Recaptcha solved");
      },
      "expired-callback": () => {
        console.log("Recaptcha expired");
        clearRecaptcha();
      },
    });
  };

  useEffect(() => {
    return () => {
      clearRecaptcha();
    };
  }, []);

  const sendCode = async () => {
    try {
      setLoading(true);
      setError("");

      // Format phone number
      const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

      // Check if user exists
      const { exists, message } = await checkUserExists({ 
        phoneNumber: formattedPhone 
      });

      if (!exists) {
        setError("Acest număr de telefon nu este înregistrat. Te rugăm să îți creezi un cont.");
        return;
      }

      setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      
      onCodeSent(confirmation);
    } catch (error) {
      console.error("Eroare la trimiterea codului:", error);
      setError(error.message);

      clearRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        id="recaptcha-container" 
        className="fixed bottom-4 right-4 transform scale-80 origin-bottom-right"
        style={{ zIndex: 1000 }}
      ></div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Număr de telefon
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5" />
          <input
            type="tel"
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
            placeholder="+40 723 345 915"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError("");
            }}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1">
            {error}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Vei primi un cod SMS pentru verificare
        </p>
      </div>

      <button
        className="w-full py-3 px-4 bg-primary hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200 transform focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        onClick={sendCode}
        disabled={loading || !phone}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Se trimite...
          </span>
        ) : (
          "Trimite Codul"
        )}
      </button>
    </div>
  );
};

export default SendCodeForm;