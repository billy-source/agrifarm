import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Filter,
  Download,
  Search,
  Plus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import QuickExpenseForm from './QuickExpenseForm';

const ExpenseTracker = ({ expenses, onAddExpense }) => {
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');

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

  const COLORS = [
    '#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280'
  ];

  // Filter and search expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesDate = true;
      if (dateRange !== 'all') {
        const expenseDate = new Date(expense.date);
        const now = new Date();
        
        switch (dateRange) {
          case 'week':
            matchesDate = (now - expenseDate) <= 7 * 24 * 60 * 60 * 1000;
            break;
          case 'month':
            matchesDate = expenseDate.getMonth() === now.getMonth() && 
                         expenseDate.getFullYear() === now.getFullYear();
            break;
          case 'year':
            matchesDate = expenseDate.getFullYear() === now.getFullYear();
            break;
        }
      }
      
      return matchesCategory && matchesSearch && matchesDate;
    });
  }, [expenses, filterCategory, searchTerm, dateRange]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const categoryTotals = categories.map(category => ({
      name: category,
      value: filteredExpenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0)
    })).filter(item => item.value > 0);

    const monthlyData = {};
    filteredExpenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
    });

    const monthlyChart = Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount
    }));

    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const avgExpense = filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0;

    return {
      categoryTotals,
      monthlyChart,
      totalExpenses,
      avgExpense,
      transactionCount: filteredExpenses.length
    };
  }, [filteredExpenses, categories]);

  const handleAddExpense = async (newExpense) => {
    await onAddExpense(newExpense);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Expense Tracking</h2>
          <p className="text-gray-600">Monitor and analyze your farming expenses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-blue-600">${analytics.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Expense</p>
              <p className="text-2xl font-bold text-green-600">${analytics.avgExpense.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-purple-600">{analytics.transactionCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthlyChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Bar dataKey="amount" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.categoryTotals}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.categoryTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.slice(0, 10).map((expense) => (
              <div key={expense.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{expense.description}</h4>
                    <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                        {expense.category}
                      </span>
                      <span>{expense.date}</span>
                    </div>
                    {expense.notes && (
                      <p className="mt-2 text-sm text-gray-600">{expense.notes}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-semibold text-gray-900">${expense.amount}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No expenses found. Start by adding your first expense!
            </div>
          )}
        </div>
      </div>

      {/* Quick Expense Form Modal */}
      {showForm && (
        <QuickExpenseForm
          onSubmit={handleAddExpense}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ExpenseTracker;