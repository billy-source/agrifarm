import React, { useState } from 'react';
import { 
  Droplets, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Gauge
} from 'lucide-react';

const IrrigationScheduler = ({ schedule = [], weatherData }) => {
  const [activeTask, setActiveTask] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'overdue':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'scheduled':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMoistureColor = (moisture) => {
    if (moisture < 30) return 'text-red-600';
    if (moisture < 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getMoistureStatus = (moisture) => {
    if (moisture < 30) return 'Critical';
    if (moisture < 50) return 'Low';
    return 'Good';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Irrigation Schedule</h2>
          <p className="text-gray-600">Smart watering recommendations based on soil and weather</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Field</span>
        </button>
      </div>

      {/* Weather Impact Alert */}
      {weatherData?.alerts && weatherData.alerts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-800">Weather Alert</h4>
              <p className="text-sm text-orange-700 mt-1">
                {weatherData.alerts[0].description} Consider adjusting irrigation schedules accordingly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fields</p>
              <p className="text-2xl font-bold text-blue-600">{schedule.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Droplets className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Tasks</p>
              <p className="text-2xl font-bold text-red-600">
                {schedule.filter(task => task.status === 'overdue').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled Today</p>
              <p className="text-2xl font-bold text-green-600">
                {schedule.filter(task => 
                  task.nextWatering === new Date().toISOString().split('T')[0]
                ).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Moisture</p>
              <p className="text-2xl font-bold text-blue-600">
                {schedule.length > 0 
                  ? Math.round(schedule.reduce((sum, task) => sum + task.soilMoisture, 0) / schedule.length)
                  : 0}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Gauge className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Irrigation Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Irrigation Tasks</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {schedule.length > 0 ? (
            schedule.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(task.status)}
                      <h4 className="font-medium text-gray-900">{task.cropArea}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Next Watering</p>
                          <p className="text-sm text-gray-600">{task.nextWatering}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Droplets className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Water Amount</p>
                          <p className="text-sm text-gray-600">{task.waterAmount}L</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Gauge className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Soil Moisture</p>
                          <p className={`text-sm font-medium ${getMoistureColor(task.soilMoisture)}`}>
                            {task.soilMoisture}% ({getMoistureStatus(task.soilMoisture)})
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Last watered: {task.lastWatered}
                      </p>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                          Edit Schedule
                        </button>
                        {task.status !== 'completed' && (
                          <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Droplets className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No irrigation schedules yet</p>
              <p>Add your first field to start tracking irrigation needs.</p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add Your First Field
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Smart Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Recommendations</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <Droplets className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Water Conservation Tip</h4>
              <p className="text-sm text-blue-800 mt-1">
                With expected rainfall tomorrow, consider reducing irrigation by 30% for outdoor crops.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">Moisture Alert</h4>
              <p className="text-sm text-yellow-800 mt-1">
                South Field - Soybeans shows critically low moisture (35%). Immediate watering recommended.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrrigationScheduler;