import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, Clock, XCircle, RefreshCw, X, ArrowRight, Bell } from 'lucide-react';
import { OrderStatus } from '../types';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  status?: OrderStatus;
  orderId?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  dismissToast: (id: string) => void;
  notifyOrderStatusChange: (orderId: string, status: OrderStatus, note?: string, onTrack?: (orderId: string) => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = { ...toast, id };

    setToasts((prev) => [newToast, ...prev].slice(0, 4)); // keep max 4 toasts

    const duration = toast.duration ?? 7000;
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }, [dismissToast]);

  const notifyOrderStatusChange = useCallback(
    (orderId: string, status: OrderStatus, note?: string, onTrack?: (orderId: string) => void) => {
      let title = `অর্ডার স্ট্যাটাস আপডেট: ${orderId}`;
      let message = '';
      let type: ToastItem['type'] = 'info';

      switch (status) {
        case 'pending':
          title = `অর্ডার গৃহীত হয়েছে: ${orderId}`;
          message = note || 'আপনার অর্ডারটি পেন্ডিং রয়েছে। অ্যাডমিন TrxID যাচাই করছেন।';
          type = 'warning';
          break;
        case 'processing':
          title = `ডায়মন্ড প্রসেসিং চলছে: ${orderId}`;
          message = note || 'পেমেন্ট ভেরিফাই হয়েছে! আপনার Free Fire Player UID-তে ডায়মন্ড পাঠানো হচ্ছে।';
          type = 'info';
          break;
        case 'completed':
          title = `ডায়মন্ড ডেলিভারি সম্পন্ন: ${orderId}`;
          message = note || 'অভিনন্দন! আপনার অ্যাকাউন্টে ডায়মন্ড সফলভাবে জমা হয়ে গেছে। গেম চেক করুন।';
          type = 'success';
          break;
        case 'rejected':
          title = `অর্ডার সংক্রান্ত বিজ্ঞপ্তি: ${orderId}`;
          message = note || 'অর্ডারটি বাতিল করা হয়েছে। ভুল TrxID বা তথ্যের জন্য হেল্পলাইনে যোগাযোগ করুন।';
          type = 'error';
          break;
      }

      showToast({
        title,
        message,
        status,
        orderId,
        type,
        duration: 8000,
        action: onTrack
          ? {
              label: 'অর্ডারের অবস্থা দেখুন',
              onClick: () => onTrack(orderId),
            }
          : undefined,
      });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast, notifyOrderStatusChange }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Visual Toast Snackbar Container
const ToastContainer: React.FC<{ toasts: ToastItem[]; onDismiss: (id: string) => void }> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-20 right-3 sm:right-6 z-50 flex flex-col gap-3 w-[calc(100vw-1.5rem)] sm:w-96 max-w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

const ToastCard: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const getStatusVisuals = () => {
    switch (toast.status) {
      case 'completed':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          borderColor: 'border-emerald-500/50',
          glowColor: 'shadow-emerald-950/70',
          badgeBg: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/50',
          badgeLabel: 'Completed',
        };
      case 'processing':
        return {
          icon: <RefreshCw className="w-5 h-5 text-cyan-400 shrink-0 animate-spin" />,
          borderColor: 'border-cyan-500/50',
          glowColor: 'shadow-cyan-950/70',
          badgeBg: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/50',
          badgeLabel: 'Processing',
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
          borderColor: 'border-red-500/50',
          glowColor: 'shadow-red-950/70',
          badgeBg: 'bg-red-950/70 text-red-300 border-red-800/50',
          badgeLabel: 'Rejected',
        };
      case 'pending':
      default:
        return {
          icon: <Clock className="w-5 h-5 text-amber-400 shrink-0" />,
          borderColor: 'border-purple-600/60',
          glowColor: 'shadow-purple-950/70',
          badgeBg: 'bg-purple-950/70 text-purple-300 border-purple-800/50',
          badgeLabel: 'Pending',
        };
    }
  };

  const visuals = getStatusVisuals();

  return (
    <div
      role="alert"
      className={`pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100 rounded-2xl bg-[#0e0721]/95 backdrop-blur-md border ${visuals.borderColor} p-4 shadow-2xl ${visuals.glowColor} text-slate-100 relative overflow-hidden group`}
    >
      {/* Top accent light */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500" />

      <div className="flex items-start gap-3">
        <div className="p-1 rounded-xl bg-[#170a35] border border-purple-800/40">
          {visuals.icon}
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-white tracking-wide truncate">
              {toast.title}
            </span>
            {toast.status && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${visuals.badgeBg}`}>
                {visuals.badgeLabel}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
            {toast.message}
          </p>

          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick();
                onDismiss();
              }}
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-[11px] font-bold text-white shadow-md shadow-purple-950 transition-all cursor-pointer active:scale-95"
            >
              <span>{toast.action.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute top-3.5 right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
