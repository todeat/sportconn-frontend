import React, { useState } from 'react';
import { Mail, X, Send, ArrowRight, Loader2, CheckCircle2, Info } from 'lucide-react';
import { sendVerificationCode, verifyCode } from '../../services/api';

const EmailVerificationModal = ({ isOpen, onClose, email, onVerificationSuccess  }) => {
  const [step, setStep] = useState('initial'); // initial, code-sent, verifying
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendCode = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await sendVerificationCode({ email });
      
      if (response.success) {
        setStep('code-sent');
      } else {
        setError(response.message || 'A apărut o eroare la trimiterea codului');
      }
    } catch (error) {
      setError('A apărut o eroare la trimiterea codului');
    } finally {
      setLoading(false);
    }
  };

  

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError('Te rugăm să introduci codul de verificare');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await verifyCode({ 
        email,
        code: verificationCode 
      });
      
      if (response.success) {
        setSuccess(true);
        if (onVerificationSuccess) {
            onVerificationSuccess();
          }
          setTimeout(() => {
            onClose();
            // Reset state pentru următoarea deschidere
            setStep('initial');
            setVerificationCode('');
            setSuccess(false);
          }, 2000);
      } else {
        setError(response.message || 'Cod invalid');
      }
    } catch (error) {
      setError('A apărut o eroare la verificarea codului');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-primary flex items-center">
              <Mail className="w-6 h-6 mr-2" />
              Verificare Email
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {success ? (
              <div className="text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <p className="text-green-600 font-medium">
                  Email-ul tău a fost verificat cu succes!
                </p>
              </div>
            ) : step === 'initial' ? (
              <>
                <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-primary mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-primary font-medium">
                        Confirmare adresă email
                      </p>
                      <p className="text-sm text-gray-600">
                        Pentru a verifica adresa ta de email ({email}), vom trimite un cod de confirmare. 
                        Te rugăm să verifici și folderul de spam dacă nu primești emailul în câteva minute.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-100 text-white font-medium rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Se trimite...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Trimite codul de verificare
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cod de verificare
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Introdu codul primit pe email"
                  />
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                </div>

                <button
                  onClick={handleVerifyCode}
                  disabled={loading || !verificationCode}
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-100 text-white font-medium rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Se verifică...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Verifică codul
                    </>
                  )}
                </button>

                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full py-2 px-4 text-primary-100 hover:text-primary hover:bg-primary/5 font-medium rounded-lg transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Retrimite codul
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerificationModal;