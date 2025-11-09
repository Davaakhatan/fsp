import { 
  Plane, 
  Calendar, 
  AlertCircle,
  Clock,
  Users,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { useDashboardStats, useBookings, useWeatherAlerts } from '../hooks/useApi';
import { formatTime } from '@fsp/shared';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const { data: alerts, isLoading: alertsLoading } = useWeatherAlerts();

  const upcomingFlights = bookings?.slice(0, 5) || [];
  const activeAlerts = alerts?.slice(0, 3) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of flight operations and weather conditions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Active Flights', 
            value: stats?.activeFlights || 0, 
            change: '+0', 
            icon: Plane, 
            color: 'blue',
            bgGradient: 'from-blue-500 to-blue-600'
          },
          { 
            label: 'Weather Alerts', 
            value: stats?.weatherAlerts || 0, 
            change: '+0', 
            icon: AlertCircle, 
            color: 'orange',
            bgGradient: 'from-orange-500 to-orange-600'
          },
          { 
            label: 'Scheduled Today', 
            value: stats?.todayBookings || 0, 
            change: '+0', 
            icon: Calendar, 
            color: 'emerald',
            bgGradient: 'from-emerald-500 to-emerald-600'
          },
          { 
            label: 'Total Bookings', 
            value: stats?.totalBookings || 0, 
            change: '+0', 
            icon: TrendingUp, 
            color: 'purple',
            bgGradient: 'from-purple-500 to-purple-600'
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all hover:shadow-xl overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Flights - 2/3 width */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Upcoming Flights</h2>
                <p className="text-sm text-gray-500 mt-1">Next 48 hours</p>
              </div>
              <a
                href="/bookings"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 group"
              >
                View All
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="divide-y divide-gray-100">
              {bookingsLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : upcomingFlights.length === 0 ? (
                <div className="p-12 text-center">
                  <Plane className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming flights</p>
                </div>
              ) : (
                upcomingFlights.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="p-6 hover:bg-gray-50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 min-w-[80px] group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                          <div className="text-2xl font-bold text-blue-900">
                            {new Date(booking.scheduledTime).getDate()}
                          </div>
                          <div className="text-xs font-medium text-blue-600 uppercase">
                            {new Date(booking.scheduledTime).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{booking.student?.name}</h4>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(booking.scheduledTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Plane className="h-4 w-4" />
                            {booking.aircraft?.tailNumber}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {booking.instructor?.name}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Weather Alerts - 1/3 width */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {activeAlerts.length} alert{activeAlerts.length !== 1 ? 's' : ''}
                </p>
              </div>
              <a
                href="/alerts"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 group"
              >
                View All
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="divide-y divide-gray-100">
              {alertsLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-600 border-t-transparent"></div>
                </div>
              ) : activeAlerts.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-3">
                    <AlertCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">All Clear!</p>
                  <p className="text-xs text-gray-500">No active weather alerts</p>
                </div>
              ) : (
                activeAlerts.map((alert: any) => (
                  <div
                    key={alert.id}
                    className="p-6 hover:bg-orange-50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 mb-1">
                          {alert.booking?.location || 'Unknown Location'}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {alert.booking?.studentName || 'Unknown Student'}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {alert.violatedMinimums?.slice(0, 2).map((minimum: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700"
                            >
                              {minimum}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
