import Layout from '@/components/Layout';
import { AlertCircle, Cloud, Plane, Users, Calendar } from 'lucide-react';
import { useBookings, useDashboardStats, useWeatherAlerts } from '@/hooks/useApi';
import { formatDateTime, formatTime } from '@fsp/shared';

export default function Dashboard() {
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const { data: stats } = useDashboardStats();
  const { data: alerts } = useWeatherAlerts();

  // Default stats while loading or if no data
  const displayStats = [
    { 
      label: 'Active Flights', 
      value: stats?.activeFlights?.toString() || '0', 
      icon: Plane, 
      trend: stats?.activeFlightsTrend || '+0' 
    },
    { 
      label: 'Weather Alerts', 
      value: alerts?.length?.toString() || '0', 
      icon: AlertCircle, 
      trend: stats?.alertsTrend || '0' 
    },
    { 
      label: 'Scheduled Today', 
      value: stats?.scheduledToday?.toString() || '0', 
      icon: Calendar, 
      trend: stats?.scheduledTodayTrend || '+0' 
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-1">
            Overview of flight operations and weather conditions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </h3>
                  <Icon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <span className="text-xs text-green-600 font-medium">
                    {stat.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Weather Alerts Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Active Weather Alerts
            </h3>
            {alerts && alerts.length > 0 && (
              <span className="text-sm text-gray-500">
                {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {!alerts || alerts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Cloud className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No active weather alerts
              </h4>
              <p className="text-sm text-gray-500">
                All scheduled flights are clear for the next 48 hours
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert: any) => (
                <div
                  key={alert.id}
                  className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900">
                        Weather Conflict - {alert.booking?.location || 'Unknown Location'}
                      </h4>
                      <p className="text-sm text-red-700 mt-1">
                        {alert.booking?.studentName || 'Unknown Student'} - {formatDateTime(alert.booking?.scheduledTime || new Date())}
                      </p>
                      <p className="text-xs text-red-600 mt-2">
                        {alert.violatedMinimums?.join(', ') || 'Weather minimums violated'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Flights */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Upcoming Flights
            </h3>
            {bookings && bookings.length > 0 && (
              <span className="text-sm text-gray-500">
                Next 48 hours
              </span>
            )}
          </div>
          
          {bookingsLoading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : !bookings || bookings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Plane className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No flights scheduled
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Schedule your first flight to get started
              </p>
              <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-smooth shadow-sm">
                Schedule Flight
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {bookings.slice(0, 5).map((booking: any) => (
                <div
                  key={booking.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">
                          {booking.student?.name || 'Student'}
                        </h4>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'SCHEDULED'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'WEATHER_HOLD'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatTime(booking.scheduledTime)} • {booking.departureLocation?.name || 'Location'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Instructor: {booking.instructor?.name || 'TBD'} • Aircraft: {booking.aircraft?.registration || 'TBD'}
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

