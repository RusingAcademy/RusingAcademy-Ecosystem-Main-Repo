import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration (default 5 seconds)
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message, duration: 7000 });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  };

  const bgColors = {
    success: 'bg-green-900/80 border-green-500/50',
    error: 'bg-red-900/80 border-red-500/50',
    info: 'bg-blue-900/80 border-blue-500/50',
    warning: 'bg-yellow-900/80 border-yellow-500/50',
  };

  return (
    <div
      className={`${bgColors[toast.type]} backdrop-blur-lg border rounded-lg p-4 shadow-lg animate-slide-in-right flex items-start gap-3 min-w-[300px]`}
      role="alert"
    >
      {icons[toast.type]}
      <div className="flex-1">
        <h4 className="font-semibold text-white">{toast.title}</h4>
        {toast.message && (
          <p className="text-sm text-gray-300 mt-1">{toast.message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Bilingual toast messages
export const toastMessages = {
  en: {
    profileUpdated: { title: 'Profile Updated', message: 'Your profile has been saved successfully.' },
    paymentSuccess: { title: 'Payment Successful', message: 'Thank you for your purchase!' },
    paymentFailed: { title: 'Payment Failed', message: 'Please try again or contact support.' },
    sessionBooked: { title: 'Session Booked', message: 'Your coaching session has been scheduled.' },
    quotaExhausted: { title: 'AI Credits Exhausted', message: 'Purchase a top-up to continue.' },
    topupPurchased: { title: 'Top-up Purchased', message: '60 minutes added to your account.' },
    loginSuccess: { title: 'Welcome Back!', message: 'You have successfully logged in.' },
    logoutSuccess: { title: 'Logged Out', message: 'You have been logged out successfully.' },
    errorGeneric: { title: 'Error', message: 'Something went wrong. Please try again.' },
    copied: { title: 'Copied!', message: 'Content copied to clipboard.' },
  },
  fr: {
    profileUpdated: { title: 'Profil Mis à Jour', message: 'Votre profil a été enregistré avec succès.' },
    paymentSuccess: { title: 'Paiement Réussi', message: 'Merci pour votre achat!' },
    paymentFailed: { title: 'Paiement Échoué', message: 'Veuillez réessayer ou contacter le support.' },
    sessionBooked: { title: 'Session Réservée', message: 'Votre session de coaching a été programmée.' },
    quotaExhausted: { title: 'Crédits IA Épuisés', message: 'Achetez un recharge pour continuer.' },
    topupPurchased: { title: 'Recharge Achetée', message: '60 minutes ajoutées à votre compte.' },
    loginSuccess: { title: 'Bienvenue!', message: 'Vous êtes connecté avec succès.' },
    logoutSuccess: { title: 'Déconnecté', message: 'Vous avez été déconnecté avec succès.' },
    errorGeneric: { title: 'Erreur', message: 'Une erreur est survenue. Veuillez réessayer.' },
    copied: { title: 'Copié!', message: 'Contenu copié dans le presse-papiers.' },
  },
};

export default ToastProvider;
