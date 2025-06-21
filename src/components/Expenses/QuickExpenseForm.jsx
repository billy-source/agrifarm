import React, { useState, useEffect, useRef } from 'react';
import { X, DollarSign, Tag, FileText } from 'lucide-react';

const QuickExpenseForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Seeds & Planting',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const descriptionRef = useRef(null);

  const categories = [
    'Seeds & Planting',
    'Fertilizers',
    'Pesticides',
    'Labor',
    'Equipment',
    'Fuel',
    'Maintenance',
    'Utilities',
    'Insurance',
    'Other'
  ];

  // Auto-focus on mount
  useEffect(() => {
    descriptionRef.current?.focus();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.ctrlKey && e.key === 'Enter') {
        handleSubmit(e);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        category: 'Seeds & Planting',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Quick Add Expense</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={descriptionRef}
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Corn seeds for north field"
                required
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Additional details..."
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.description || !formData.amount}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>

        {/* Keyboard Shortcuts */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Enter</kbd> to save • <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd> to cancel
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickExpenseForm;