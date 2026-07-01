import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

interface GoogleCalendarAuthModalProps {
  isOpen: boolean;
  employeeName: string;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export function GoogleCalendarAuthModal({
  isOpen,
  employeeName,
  onClose,
  onSubmit,
}: GoogleCalendarAuthModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(email);
      setEmail('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" style={{ direction: 'rtl' }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            אישור גישה ליומן Google
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-slate-600 text-sm mb-4">
            הנא הכנס את כתובת המייל של <span className="font-semibold">{employeeName}</span> כדי לאפשר מעקב יומן:
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                כתובת מייל
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="employee@company.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium"
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={loading || !email}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'טוען...' : 'אישור'}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}