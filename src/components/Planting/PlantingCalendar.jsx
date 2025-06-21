import React, { useState } from 'react';
import { 
  Sprout, 
  Calendar, 
  TrendingUp, 
  MapPin,
  Clock,
  DollarSign,
  Thermometer,
  Plus
} from 'lucide-react';

const PlantingCalendar = ({ recommendations = [], weatherData }) => {
  const [selectedCrop, setSelectedCrop] = useState(null);

  const getProfitabilityColor = (profitability) => {
    switch (profitability) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isInPlantingWindow = (plantingWindow) => {
    const today = new Date();
    const start = new Date(plantingWindow.start);
    const end = new Date(plantingWindow.end);
    return today >= start && today <= end;
  };

  const getDaysUntilPlanting = (plantingWindow) => {
    const today = new Date();
    const start = new Date(plantingWindow.start);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const mockRecommendations = recommendations.length > 0 ? recommendations : [
    {
      id: '1',
      crop: 'Summer Corn',
      plantingWindow: { start: '2024-03-15', end: '2024-04-30' },
      expectedHarvest: '2024-08-15',
      soilRequirements: 'Well-drained, pH 6.0-7.0',
      expectedYield: 180,
      profitability: 'high'
    },
    {
      id: '2',
      crop: 'Soybeans',
      plantingWindow: { start: '2024-04-01', end: '2024-05-15' },
      expectedHarvest: '2024-09-30',
      soilRequirements: 'Fertile loam, pH 6.0-7.0',
      expectedYield: 50,
      profitability: 'medium'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Planting Calendar</h2>
          <p className="text-gray-600">AI-powered planting recommendations for optimal yields</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Crop Plan</span>
        </button>
      </div>

      {/* Current Season Overview */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Spring Planting Season 2024</h3>
            <p className="opacity-90">Optimal conditions for corn and soybean planting</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Current Temperature</p>
            <p className="text-2xl font-bold">{weatherData?.current?.temperature || 24}°C</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Plans</p>
              <p className="text-2xl font-bold text-green-600">{mockRecommendations.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Sprout className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ready to Plant</p>
              <p className="text-2xl font-bold text-blue-600">
                {mockRecommendations.filter(rec => isInPlantingWindow(rec.plantingWindow)).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expected Yield</p>
              <p className="text-2xl font-bold text-purple-600">
                {mockRecommendations.reduce((sum, rec) => sum + rec.expectedYield, 0)} bu/ac
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Profit Crops</p>
              <p className="text-2xl font-bold text-green-600">
                {mockRecommendations.filter(rec => rec.profitability === 'high').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Planting Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Planting Recommendations</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {mockRecommendations.map((recommendation) => {
            const daysUntilPlanting = getDaysUntilPlanting(recommendation.plantingWindow);
            const inWindow = isInPlantingWindow(recommendation.plantingWindow);
            
            return (
              <div key={recommendation.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Sprout className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900 text-lg">{recommendation.crop}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getProfitabilityColor(recommendation.profitability)}`}>
                        {recommendation.profitability} profit
                      </span>
                      {inWindow && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          Plant Now!
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Planting Window</p>
                          <p className="text-sm text-gray-600">
                            {new Date(recommendation.plantingWindow.start).toLocaleDateString()} - {new Date(recommendation.plantingWindow.end).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Expected Harvest</p>
                          <p className="text-sm text-gray-600">
                            {new Date(recommendation.expectedHarvest).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Expected Yield</p>
                          <p className="text-sm text-gray-600">{recommendation.expectedYield} bu/ac</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Soil Requirements</p>
                          <p className="text-sm text-gray-600">{recommendation.soilRequirements}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {inWindow ? (
                          <span className="text-green-600 font-medium">✓ Ready to plant now</span>
                        ) : daysUntilPlanting > 0 ? (
                          <span>Planting starts in {daysUntilPlanting} days</span>
                        ) : (
                          <span className="text-red-600">Planting window closed</span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedCrop(recommendation)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          View Details
                        </button>
                        {inWindow && (
                          <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                            Start Planting
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seasonal Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Planting Calendar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Spring', 'Summer', 'Fall', 'Winter'].map((season, index) => (
            <div key={season} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{season} 2024</h4>
              <div className="space-y-2 text-sm">
                {season === 'Spring' && (
                  <>
                    <p className="text-green-600">• Corn (Mar-Apr)</p>
                    <p className="text-green-600">• Soybeans (Apr-May)</p>
                    <p className="text-green-600">• Potatoes (Mar-Apr)</p>
                  </>
                )}
                {season === 'Summer' && (
                  <>
                    <p className="text-yellow-600">• Late Corn (Jun-Jul)</p>
                    <p className="text-yellow-600">• Sunflowers (Jun)</p>
                  </>
                )}
                {season === 'Fall' && (
                  <>
                    <p className="text-orange-600">• Winter Wheat (Sep-Oct)</p>
                    <p className="text-orange-600">• Cover Crops (Oct)</p>
                  </>
                )}
                {season === 'Winter' && (
                  <>
                    <p className="text-blue-600">• Planning Season</p>
                    <p className="text-blue-600">• Soil Preparation</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Insights</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
            <Sprout className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Optimal Planting Recommendation</h4>
              <p className="text-sm text-green-800 mt-1">
                Based on historical data and current weather patterns, corn planting in the next 2 weeks could increase yield by 15%.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Market Analysis</h4>
              <p className="text-sm text-blue-800 mt-1">
                Soybean prices are projected to increase by 8% this season. Consider allocating more acreage to soybeans.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
            <Thermometer className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">Climate Consideration</h4>
              <p className="text-sm text-yellow-800 mt-1">
                Extended warm weather expected. Consider drought-resistant varieties for late plantings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantingCalendar;