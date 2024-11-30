import React, { useState } from "react";
import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const PhoneAuth = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        'expired-callback': () => {
          console.log("Recaptcha expired");
        }
      });
    }
  };

  const sendCode = async () => {
    try {
      setLoading(true);
      setupRecaptcha();
      
      // Ensure phone number is properly formatted
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      alert("Cod trimis cu succes!");
    } catch (error) {
      console.error("Eroare la trimiterea codului:", error);
      alert(`Eroare: ${error.message}`);
      
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        try {
          await window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (clearError) {
          console.error("Eroare la resetarea reCAPTCHA:", clearError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!confirmationResult) {
      alert("Te rugăm să soliciți mai întâi codul de verificare");
      return;
    }

    try {
      setLoading(true);
      const result = await confirmationResult.confirm(code);
      console.log("Autentificare reușită:", result.user);
      alert("Autentificare reușită!");
    } catch (error) {
      console.error("Eroare la verificarea codului:", error);
      alert("Cod invalid sau expirat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Autentificare prin Telefon</h2>
      
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" className="invisible"></div>
      
      {!confirmationResult ? (
        <div className="space-y-4">
          <input
            type="tel"
            className="w-full p-2 border rounded"
            placeholder="Număr de telefon (ex: +40723345915)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            onClick={sendCode}
            disabled={loading || !phone}
          >
            {loading ? "Se trimite..." : "Trimite Codul"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Cod de verificare"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            onClick={verifyCode}
            disabled={loading || !code}
          >
            {loading ? "Se verifică..." : "Verifică Codul"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PhoneAuth;