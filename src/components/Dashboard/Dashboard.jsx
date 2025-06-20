import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Droplets, 
  Sprout,
  AlertTriangle,
  Calendar,
  BarChart3,
  Plus,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFirestore } from '../../hooks/useFirebase';
import WeatherCard from '../Weather/WeatherCard';
import ExpenseTracker from '../Expenses/ExpenseTracker';
import IrrigationScheduler from '../Irrigation/IrrigationScheduler';
import PlantingCalendar from '../Planting/PlantingCalendar';
import QuickExpenseForm from '../Expenses/QuickExpenseForm';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const { data: expenses, addItem: addExpense } = useFirestore('expenses');
  const { data: irrigationTasks } = useFirestore('irrigation');
  const { data: plantingData } = useFirestore('planting');
  
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [weatherData, setWeatherData] = useState(null);

 
  const mockWeatherData = {
    location: 'Farm Location, State',
    current: {
      temperature: 24,
      humidity: 65,
      windSpeed: 12,
      condition: 'Partly Cloudy',
      icon: 'partly-cloudy'
    },
    forecast: [
      { date: '2024-01-25', high: 26, low: 18, condition: 'Sunny', icon: 'sun', precipitation: 0 },
      { date: '2024-01-26', high: 23, low: 16, condition: 'Cloudy', icon: 'cloud', precipitation: 20 },
      { date: '2024-01-27', high: 21, low: 14, condition: 'Rain', icon: 'cloud-rain', precipitation: 80 },
      { date: '2024-01-28', high: 25, low: 17, condition: 'Sunny', icon: 'sun', precipitation: 5 }
    ],
    alerts: [
      {
        type: 'warning',
        title: 'Rain Expected',
        description: 'Heavy rainfall expected tomorrow. Consider postponing outdoor activities.',
        severity: 'medium'
      }
    ]
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        setShowQuickForm(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Calculate metrics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const currentMonth = new Date().getMonth();
    return expenseDate.getMonth() === currentMonth;
  }).reduce((sum, expense) => sum + expense.amount, 0);

  const overdueTasks = irrigationTasks.filter(task => task.status === 'overdue').length;
  const upcomingPlanting = plantingData.length;

  const handleAddExpense = async (newExpense) => {
    try {
      await addExpense({
        ...newExpense,
        date: new Date().toISOString().split('T')[0]
      });
      setShowQuickForm(false);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
                <p className="text-sm text-gray-500">Welcome back, {currentUser?.displayName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowQuickForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Quick Add</span>
                <span className="text-xs opacity-75">(Ctrl+E)</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 p-2"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
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

            {/* Weather and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <WeatherCard weatherData={mockWeatherData} />
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
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
                    {expenses.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No expenses recorded yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <ExpenseTracker expenses={expenses} onAddExpense={handleAddExpense} />
        )}

        {/* Irrigation Tab */}
        {activeTab === 'irrigation' && (
          <IrrigationScheduler 
            schedule={irrigationTasks} 
            weatherData={mockWeatherData} 
          />
        )}

        {/* Planting Tab */}
        {activeTab === 'planting' && (
          <PlantingCalendar 
            recommendations={plantingData}
            weatherData={mockWeatherData}
          />
        )}
      </div>

      {/* Quick Expense Form Modal */}
      {showQuickForm && (
        <QuickExpenseForm
          onSubmit={handleAddExpense}
          onClose={() => setShowQuickForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;