import { useState } from 'react';
import { 
  AlertCircle, 
  Cloud, 
  Wind, 
  Eye, 
  X,
  MapPin,
  Clock,
  User,
  Plane
} from 'lucide-react';
import { useWeatherAlerts } from '../hooks/useApi';
import { formatDateTime } from '@fsp/shared';

export default function WeatherAlerts() {
  const { data: alerts, isLoading } = useWeatherAlerts();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  // Filter alerts by severity
  const filteredAlerts = alerts?.filter(alert => 
    selectedSeverity === 'ALL' || alert.severity === selectedSeverity
  ) || [];

  // Stats
  const stats = {
    total: alerts?.length || 0,
    critical: alerts?.filter(a => a.severity === 'CRITICAL').length || 0,
    high: alerts?.filter(a => a.severity === 'HIGH').length || 0,
    mediumLow: alerts?.filter(a => a.severity === 'MEDIUM' || a.severity === 'LOW').length || 0,
  };

  const getSeverityStyle = (severity: string) => {
    const styles = {
      CRITICAL: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
      HIGH: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
      MEDIUM: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
      LOW: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    }[severity] || 'bg-gray-50 text-gray-700 border-gray-200';

    return styles;
  };

  const getSeverityIcon = (severity: string) => {
    return severity === 'CRITICAL' ? 'bg-red-500' : 
           severity === 'HIGH' ? 'bg-orange-500' : 
           severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Alerts</h1>
            <p className="text-gray-600">Monitor weather conditions affecting flight operations</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-700">Live Monitoring</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Alerts', value: stats.total, icon: AlertCircle, color: 'gray', filter: 'ALL' },
          { label: 'Critical', value: stats.critical, icon: AlertCircle, color: 'red', filter: 'CRITICAL' },
          { label: 'High', value: stats.high, icon: AlertCircle, color: 'orange', filter: 'HIGH' },
          { label: 'Medium/Low', value: stats.mediumLow, icon: AlertCircle, color: 'yellow', filter: 'MEDIUM' },
        ].map((stat, index) => (
          <button
            key={index}
            onClick={() => setSelectedSeverity(stat.filter)}
            className={`group relative bg-white rounded-2xl p-6 border transition-all hover:shadow-xl text-left overflow-hidden ${
              selectedSeverity === stat.filter ? 'border-blue-500 shadow-lg ring-2 ring-blue-100' : 'border-gray-200'
            }`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500 opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-3">
        <span className="text-sm font-medium text-gray-700 flex items-center">Filter by severity:</span>
        {['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((severity) => (
          <button
            key={severity}
            onClick={() => setSelectedSeverity(severity === 'All' ? 'ALL' : severity)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedSeverity === (severity === 'All' ? 'ALL' : severity)
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {severity}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading weather alerts...</p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4">
            <AlertCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
          <p className="text-gray-600">No active weather alerts at this time</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert: any) => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={`bg-white rounded-2xl border transition-all hover:shadow-xl group cursor-pointer overflow-hidden ${getSeverityStyle(alert.severity)}`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Severity Indicator */}
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-xl ${getSeverityIcon(alert.severity)} shadow-lg`}>
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Alert Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {alert.severity} Weather Alert
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSeverityStyle(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Location</div>
                          <div className="font-medium">{alert.booking?.location || 'Unknown Location'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Student</div>
                          <div className="font-medium">{alert.booking?.studentName || 'Unknown Student'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Detected At</div>
                          <div className="font-medium">{formatDateTime(alert.detectedAt)}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <Plane className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Scheduled Time</div>
                          <div className="font-medium">
                            {alert.booking?.scheduledTime 
                              ? formatDateTime(alert.booking.scheduledTime)
                              : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Violated Minimums */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">Violated Minimums:</p>
                      <div className="flex flex-wrap gap-2">
                        {alert.violatedMinimums?.map((minimum: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-200"
                          >
                            {minimum.includes('Visibility') && <Eye className="h-3 w-3" />}
                            {minimum.includes('Wind') && <Wind className="h-3 w-3" />}
                            {minimum.includes('Ceiling') && <Cloud className="h-3 w-3" />}
                            {minimum}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setSelectedAlert(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${getSeverityIcon(selectedAlert.severity)} shadow-lg`}>
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Weather Alert Details</h2>
                  <p className="text-sm text-gray-600">Alert ID: {selectedAlert.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 transform"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Severity Badge */}
              <div>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getSeverityStyle(selectedAlert.severity)}`}>
                  {selectedAlert.severity} SEVERITY
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{selectedAlert.booking?.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Student</p>
                  <p className="font-semibold text-gray-900">{selectedAlert.booking?.studentName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Detected At</p>
                  <p className="font-semibold text-gray-900">{formatDateTime(selectedAlert.detectedAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <p className="font-semibold text-gray-900">Active</p>
                </div>
              </div>

              {/* Violated Minimums */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Violated Weather Minimums:</p>
                <div className="space-y-2">
                  {selectedAlert.violatedMinimums?.map((minimum: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      {minimum.includes('Visibility') && <Eye className="h-5 w-5 text-red-600" />}
                      {minimum.includes('Wind') && <Wind className="h-5 w-5 text-red-600" />}
                      {minimum.includes('Ceiling') && <Cloud className="h-5 w-5 text-red-600" />}
                      <span className="font-medium text-red-900">{minimum}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
                  Generate Reschedule Options
                </button>
                <button 
                  onClick={() => setSelectedAlert(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
