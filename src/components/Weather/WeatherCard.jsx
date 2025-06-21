import React from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer,
  AlertTriangle
} from 'lucide-react';

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rain':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getConditionColor = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return 'from-yellow-400 to-orange-500';
      case 'cloudy':
      case 'partly cloudy':
        return 'from-gray-400 to-gray-600';
      case 'rain':
        return 'from-blue-400 to-blue-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Current Weather */}
      <div className={`bg-gradient-to-br ${getConditionColor(weatherData.current.condition)} p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{weatherData.location}</h3>
            <p className="text-sm opacity-90">{weatherData.current.condition}</p>
          </div>
          {getWeatherIcon(weatherData.current.condition)}
        </div>
        
        <div className="text-3xl font-bold mb-4">
          {weatherData.current.temperature}°C
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4" />
            <span>{weatherData.current.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4" />
            <span>{weatherData.current.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4">4-Day Forecast</h4>
        <div className="space-y-3">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                {getWeatherIcon(day.condition)}
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-500">{day.condition}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{day.high}°</p>
                <p className="text-sm text-gray-500">{day.low}°</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Alerts */}
      {weatherData.alerts && weatherData.alerts.length > 0 && (
        <div className="border-t border-gray-100 p-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
            Weather Alerts
          </h4>
          {weatherData.alerts.map((alert, index) => (
            <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="font-medium text-orange-800">{alert.title}</p>
              <p className="text-sm text-orange-700 mt-1">{alert.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherCard;