//src/pages/auth/LoginPage.js

import React, { useEffect, useState } from "react";
import SendCodeForm from "../../components/auth/SendCodeForm";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setError, setUser } from "../../store/slices/authSlice";
import PageLayout from "../../layout/PageLayout";
import { clearReturnPath, selectPendingBooking, selectReturnPath } from "../../store/slices/bookingSlice";


const LoginPage = () => {
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const returnPath = useSelector(selectReturnPath);

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);


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
        phoneNumber: result.user.phoneNumber
      };
      
      dispatch(setUser(userData));
      
      navigate(returnPath || "/profile");
      dispatch(clearReturnPath());

      
    } catch (error) {
      console.error("Eroare la verificarea codului:", error);
      alert("Cod invalid sau expirat.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToRegister = () => {
    navigate('/register');
  };


  return (
    <>
      <div 
        id="recaptcha-container" 
        className="fixed bottom-4 right-4 transform scale-80 origin-bottom-right"
        style={{ zIndex: 1000 }}
      />
      <PageLayout hideFooter>
      <div className="flex items-center justify-center h-[calc(100vh-64px)]" >
        <div className="w-full max-w-md px-8 py-10 mx-4 bg-white rounded-2xl shadow-xl transform transition-all hover:scale-[1.01]">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary text-center">
              Bine ai venit!
            </h2>
            <p className="text-sm text-gray-500 text-center mt-2">
              Autentifică-te cu numărul tău de telefon
            </p>
          </div>

          {!confirmationResult ? (
            <SendCodeForm onCodeSent={setConfirmationResult} />
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Cod de verificare
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
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
              Nu ai cont încă?{" "}
              <button
                onClick={handleGoToRegister}
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                Înregistrează-te
              </button>
            </p>
          </div>
        </div>
      </div>
      </PageLayout>
    </>
  );

};

export default LoginPage;
