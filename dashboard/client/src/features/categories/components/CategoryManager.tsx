import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { ConfirmDialog } from '../../../components/ConfirmDialog';

export const CategoryManager: React.FC = () => {
  const { categories, loading, error, addCategory, removeCategory } = useCategories();

  const [newName, setNewName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = newName.trim();
    if (!trimmed) {
      setFormError('יש להזין שם מדד.');
      return;
    }
    if (categories.some((c) => c.name.trim().toLowerCase() === trimmed.toLowerCase())) {
      setFormError('מדד בשם זה כבר קיים.');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await addCategory(trimmed);
      setNewName('');
    } catch (err) {
      setFormError('שגיאה בהוספת מדד. אנא נסה שוב.');
      console.error('Failed to create category:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    setDeleting(true);
    setFormError(null);
    try {
      await removeCategory(pendingDelete.id);
      setPendingDelete(null);
    } catch (err) {
      setFormError('שגיאה במחיקת המדד. אנא נסה שוב.');
      console.error('Failed to delete category:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-bold text-slate-800">ניהול מדדים</h2>
        <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full font-medium">
          {categories.length} מדדים למעקב
        </span>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              if (formError) setFormError(null);
            }}
            placeholder="שם מדד חדש..."
            disabled={submitting}
            className="flex-1 max-w-sm bg-white border border-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {submitting ? 'מוסיף...' : 'הוספה'}
          </button>
        </form>

        {formError && <p className="text-sm text-red-500 mb-4">{formError}</p>}

        <div className="mt-5">
          {loading ? (
            <div className="flex items-center gap-3 py-6">
              <div className="w-6 h-6 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
              <p className="text-slate-500 text-sm font-medium">טוען מדדים...</p>
            </div>
          ) : error ? (
            <p className="text-sm text-red-500 py-4">{error}</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">אין עדיין מדדים. הוסיפו את הראשונה למעלה.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-sm font-medium pr-3.5 pl-1.5 py-1.5 rounded-full"
                >
                  {category.name}
                  <button
                    type="button"
                    onClick={() => setPendingDelete({ id: category.id, name: category.name })}
                    title="מחיקת מדד"
                    aria-label={`מחיקת המדד ${category.name}`}
                    className="text-indigo-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="מחיקת מדד"
        message={`האם למחוק את המדד "${pendingDelete?.name ?? ''}"? פעולה זו אינה ניתנת לשחזור.`}
        confirmLabel="מחיקה"
        cancelLabel="ביטול"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};
