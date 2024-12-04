import React, { useState } from 'react';
import { X, Mail, Loader2 } from 'lucide-react';
import { updateEmail } from '../../services/api';

const EmailEditModal = ({ isOpen, onClose, currentEmail, onEmailUpdate }) => {
  const [email, setEmail] = useState(currentEmail);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setError('Adresa de email nu este validă');
      return;
    }

    if (email === currentEmail) {
      setError('Introdu o adresă de email diferită');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await updateEmail({ email });
      
      if (response.success) {
        onEmailUpdate(email);
        onClose();
      } else {
        setError(response.message || 'A apărut o eroare la actualizarea emailului');
      }
    } catch (error) {
      setError('A apărut o eroare la actualizarea emailului');
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
              Actualizare Email
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Adresă Email Nouă
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="nume@example.com"
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !email}
              className="w-full py-3 px-4 bg-primary hover:bg-primary-100 text-white font-medium rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Se procesează...
                </>
              ) : (
                'Actualizează Email'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailEditModal;