// src/pages/auth/RegisterPage.js
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Phone, Mail, User } from "lucide-react";
import { checkUserExists, createUser } from "../../services/api";
import PageLayout from "../../layout/PageLayout";
import { clearReturnPath, selectReturnPath } from "../../store/slices/bookingSlice";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const returnPath = useSelector(selectReturnPath);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("Recaptcha solved");
        },
        "expired-callback": () => {
          console.log("Recaptcha expired");
        },
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendCode = async () => {
    try {
      setLoading(true);
      
      const { exists, message, foundBy } = await checkUserExists({ 
        phoneNumber: formData.phoneNumber,
        email: formData.email 
      });
  
      if (exists) {
        alert(message);
        return;
      }
  
      setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(
        auth, 
        formData.phoneNumber, 
        window.recaptchaVerifier
      );
      setConfirmationResult(confirmation);
      
    } catch (error) {
      console.error("Eroare:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!confirmationResult) {
      alert("Solicită mai întâi codul de verificare.");
      return;
    }
  
    try {
      setLoading(true);
      const result = await confirmationResult.confirm(code);
  
      const userData = {
        uid: result.user.uid,
        phoneNumber: result.user.phoneNumber,
        ...formData,
      };
  
      const firebaseToken = await result.user.getIdToken();
      const apiResponse = await createUser(userData, firebaseToken);
  
      dispatch(
        setUser({
          ...userData,
          userId: apiResponse.userId,
          username: apiResponse.username,
        })
      );
  
      navigate(returnPath || "/profile");
      dispatch(clearReturnPath());

    } catch (error) {
      console.error("Eroare la verificarea codului:", error);
      alert("Cod invalid sau expirat.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.email && 
           formData.phoneNumber;
  };

  return (
    <>
      <div 
        id="recaptcha-container" 
        className="fixed bottom-4 right-4 transform scale-80 origin-bottom-right"
        style={{ zIndex: 1000 }}
      />
      <PageLayout hideFooter>
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="w-full max-w-md px-8 py-10 mx-4 bg-white rounded-2xl shadow-xl transform transition-all hover:scale-[1.01]">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary text-center">
              Creează cont
            </h2>
            <p className="text-sm text-gray-500 text-center mt-2">
              Completează datele pentru a crea un cont nou
            </p>
          </div>

          {!confirmationResult ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Prenume
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5" />
                      <input
                        type="text"
                        name="firstName"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        placeholder="Ion"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nume
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5" />
                      <input
                        type="text"
                        name="lastName"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        placeholder="Popescu"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5" />
                    <input
                      type="email"
                      name="email"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      placeholder="ion.popescu@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Număr de telefon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      placeholder="+40 723 345 915"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Vei primi un cod SMS pentru verificare
                  </p>
                </div>
              </div>

              <button
                className="w-full py-3 px-4 bg-primary hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200 transform focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={sendCode}
                disabled={loading || !isFormValid()}
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
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Cod de verificare
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="Introdu codul primit"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <button
                className="w-full py-3 px-4 bg-primary hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200 transform focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={verifyCode}
                disabled={loading || !code}
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
                    Se verifică...
                  </span>
                ) : (
                  "Verifică Codul"
                )}
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Ai deja cont?{" "}
              <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                Conectează-te
              </Link>
            </p>
          </div>
        </div>
      </div>
      </PageLayout>
    </>
  );
};

export default RegisterPage;