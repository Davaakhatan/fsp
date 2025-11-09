import { useState } from 'react';
import { 
  AlertCircle, 
  Cloud, 
  Wind, 
  Eye,
  Gauge,
  Calendar,
  User,
  MapPin,
  Plane,
  X,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useWeatherAlerts } from '../hooks/useApi';
import { formatDateTime } from '@fsp/shared';

export default function WeatherAlerts() {
  const { data: alerts, isLoading } = useWeatherAlerts();
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Filter alerts by severity
  const filteredAlerts = alerts?.filter((alert: any) => {
    if (severityFilter === 'all') return true;
    return alert.severity === severityFilter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-100',
          border: 'border-red-500',
          text: 'text-red-700',
          icon: 'text-red-500'
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-100',
          border: 'border-orange-500',
          text: 'text-orange-700',
          icon: 'text-orange-500'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-yellow-100',
          border: 'border-yellow-500',
          text: 'text-yellow-700',
          icon: 'text-yellow-500'
        };
      case 'LOW':
        return {
          bg: 'bg-blue-100',
          border: 'border-blue-500',
          text: 'text-blue-700',
          icon: 'text-blue-500'
        };
      default:
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-500',
          text: 'text-gray-700',
          icon: 'text-gray-500'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weather Alerts</h1>
          <p className="text-gray-500 mt-1">Monitor weather conditions affecting flight operations</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-gray-600">Live Monitoring</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {alerts?.length || 0}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Critical</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {alerts?.filter((a: any) => a.severity === 'CRITICAL').length || 0}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">High</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {alerts?.filter((a: any) => a.severity === 'HIGH').length || 0}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Medium/Low</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {alerts?.filter((a: any) => a.severity === 'MEDIUM' || a.severity === 'LOW').length || 0}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Filter by severity:</span>
          <div className="flex gap-2">
            {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((severity) => (
              <button
                key={severity}
                onClick={() => setSeverityFilter(severity)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  severityFilter === severity
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {severity === 'all' ? 'All' : severity}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500">Loading weather alerts...</p>
        </div>
      ) : !filteredAlerts || filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {severityFilter !== 'all' ? 'No alerts at this severity level' : 'All Clear!'}
          </h3>
          <p className="text-gray-500">
            {severityFilter !== 'all' 
              ? 'Try selecting a different severity filter'
              : 'No active weather alerts. All flights are clear to operate.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert: any) => {
            const colors = getSeverityColor(alert.severity);
            return (
              <div
                key={alert.id}
                className={`${colors.bg} border-l-4 ${colors.border} rounded-r-xl overflow-hidden`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className={`h-6 w-6 ${colors.icon} flex-shrink-0 mt-1`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-lg font-bold ${colors.text}`}>
                              {alert.severity} Weather Alert
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className={`text-sm ${colors.text} font-medium`}>
                            {alert.booking?.location || 'Unknown Location'}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedAlert(alert)}
                          className={`px-4 py-2 ${colors.text} hover:bg-white/50 rounded-lg transition-colors text-sm font-medium`}
                        >
                          View Details
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-3">
                          <User className={`h-4 w-4 ${colors.icon}`} />
                          <div>
                            <p className="text-xs text-gray-600">Student</p>
                            <p className={`text-sm font-medium ${colors.text}`}>
                              {alert.booking?.studentName || 'Unknown'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className={`h-4 w-4 ${colors.icon}`} />
                          <div>
                            <p className="text-xs text-gray-600">Scheduled Time</p>
                            <p className={`text-sm font-medium ${colors.text}`}>
                              {alert.booking?.scheduledTime 
                                ? formatDateTime(alert.booking.scheduledTime)
                                : 'Unknown'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Clock className={`h-4 w-4 ${colors.icon}`} />
                          <div>
                            <p className="text-xs text-gray-600">Detected At</p>
                            <p className={`text-sm font-medium ${colors.text}`}>
                              {formatDateTime(alert.detectedAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <MapPin className={`h-4 w-4 ${colors.icon}`} />
                          <div>
                            <p className="text-xs text-gray-600">Location</p>
                            <p className={`text-sm font-medium ${colors.text}`}>
                              {alert.booking?.location || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200/50">
                        <p className="text-xs text-gray-600 mb-2">Violated Minimums:</p>
                        <div className="flex flex-wrap gap-2">
                          {alert.violatedMinimums?.map((minimum: string, index: number) => (
                            <span
                              key={index}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                            >
                              {minimum}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Alert Details</h2>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Severity Badge */}
              <div className="flex items-center gap-3">
                <AlertCircle className={`h-8 w-8 ${getSeverityColor(selectedAlert.severity).icon}`} />
                <div>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getSeverityColor(selectedAlert.severity).bg} ${getSeverityColor(selectedAlert.severity).text}`}>
                    {selectedAlert.severity} SEVERITY
                  </span>
                </div>
              </div>

              {/* Flight Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Student</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedAlert.booking?.studentName}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Scheduled Time</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedAlert.booking?.scheduledTime 
                        ? formatDateTime(selectedAlert.booking.scheduledTime)
                        : 'Unknown'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Location</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedAlert.booking?.location}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Detected At</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {formatDateTime(selectedAlert.detectedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Violated Minimums */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Violated Weather Minimums</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <ul className="space-y-2">
                    {selectedAlert.violatedMinimums?.map((minimum: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-red-900">{minimum}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Current Conditions */}
              {selectedAlert.currentConditions && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Weather Conditions</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <Eye className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">Visibility</p>
                      <p className="text-lg font-bold text-blue-900">
                        {typeof selectedAlert.currentConditions === 'object' 
                          ? selectedAlert.currentConditions.visibility || 'N/A'
                          : 'N/A'} SM
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <Cloud className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">Ceiling</p>
                      <p className="text-lg font-bold text-purple-900">
                        {typeof selectedAlert.currentConditions === 'object'
                          ? selectedAlert.currentConditions.ceiling || 'N/A'
                          : 'N/A'} ft
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <Wind className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">Wind Speed</p>
                      <p className="text-lg font-bold text-green-900">
                        {typeof selectedAlert.currentConditions === 'object'
                          ? selectedAlert.currentConditions.wind_speed || 'N/A'
                          : 'N/A'} kts
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Generate Reschedule Options
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
