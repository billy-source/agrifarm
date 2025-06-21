import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Droplets, 
  Sprout,
  AlertTriangle,
  Calendar,
  BarChart3,
  Plus
} from 'lucide-react';
import WeatherCard from './WeatherCard';
import ExpenseTracker from './ExpenseTracker';
import IrrigationScheduler from './IrrigationScheduler';
import PlantingCalendar from './PlantingCalendar';
import QuickExpenseForm from './QuickExpenseForm';
import { mockExpenses, mockWeatherData, mockIrrigationSchedule, mockPlantingRecommendations } from '../data/mockData';

const Dashboard = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate metrics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const currentMonth = new Date().getMonth();
    return expenseDate.getMonth() === currentMonth;
  }).reduce((sum, expense) => sum + expense.amount, 0);

  const overdueTasks = mockIrrigationSchedule.filter(task => task.status === 'overdue').length;
  const upcomingPlanting = mockPlantingRecommendations.length;

  const addExpense = (newExpense) => {
    const expense = {
      ...newExpense,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([expense, ...expenses]);
    setShowQuickForm(false);
  };

  const MetricCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text', 'bg').replace('600', '100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        active 
          ? 'bg-green-600 text-white' 
          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Sprout className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AgriTracker Dashboard</h1>
                <p className="text-sm text-gray-500">Smart farming management platform</p>
              </div>
            </div>
            <button
              onClick={() => setShowQuickForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Quick Add</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto">
          <TabButton 
            id="overview" 
            label="Overview" 
            icon={BarChart3} 
            active={activeTab === 'overview'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="expenses" 
            label="Expenses" 
            icon={DollarSign} 
            active={activeTab === 'expenses'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="irrigation" 
            label="Irrigation" 
            icon={Droplets} 
            active={activeTab === 'irrigation'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="planting" 
            label="Planting" 
            icon={Sprout} 
            active={activeTab === 'planting'} 
            onClick={setActiveTab} 
          />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Expenses"
                value={`$${totalExpenses.toLocaleString()}`}
                icon={DollarSign}
                color="text-blue-600"
                subtitle="All time"
              />
              <MetricCard
                title="This Month"
                value={`$${monthlyExpenses.toLocaleString()}`}
                icon={TrendingUp}
                color="text-green-600"
                subtitle="Current month"
              />
              <MetricCard
                title="Irrigation Alerts"
                value={overdueTasks}
                icon={AlertTriangle}
                color="text-orange-600"
                subtitle="Overdue tasks"
              />
              <MetricCard
                title="Planting Ready"
                value={upcomingPlanting}
                icon={Calendar}
                color="text-purple-600"
                subtitle="Recommendations"
              />
            </div>

            {/* Weather and Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <WeatherCard weatherData={mockWeatherData} />
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {expenses.slice(0, 4).map((expense) => (
                      <div key={expense.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{expense.description}</p>
                          <p className="text-sm text-gray-500">{expense.category} • {expense.date}</p>
                        </div>
                        <span className="font-semibold text-gray-900">${expense.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <ExpenseTracker expenses={expenses} onAddExpense={addExpense} />
        )}

        {/* Irrigation Tab */}
        {activeTab === 'irrigation' && (
          <IrrigationScheduler 
            schedule={mockIrrigationSchedule} 
            weatherData={mockWeatherData} 
          />
        )}

        {/* Planting Tab */}
        {activeTab === 'planting' && (
          <PlantingCalendar 
            recommendations={mockPlantingRecommendations}
            weatherData={mockWeatherData}
          />
        )}
      </div>

      {/* Quick Expense Form Modal */}
      {showQuickForm && (
        <QuickExpenseForm
          onSubmit={addExpense}
          onClose={() => setShowQuickForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;