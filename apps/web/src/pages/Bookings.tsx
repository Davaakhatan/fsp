import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Plane, 
  MapPin,
  Plus,
  Search,
  Filter,
  X,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useBookings } from '../hooks/useApi';
import { formatDateTime, formatTime, formatDate } from '@fsp/shared';

export default function Bookings() {
  const { data: bookings, isLoading } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter bookings
  const filteredBookings = bookings?.filter((booking: any) => {
    const matchesSearch = 
      booking.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.aircraft?.tailNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      SCHEDULED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      IN_FLIGHT: 'bg-sky-50 text-sky-700 border-sky-200',
      COMPLETED: 'bg-gray-50 text-gray-600 border-gray-200',
      CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
      WEATHER_HOLD: 'bg-amber-50 text-amber-700 border-amber-200',
    }[status] || 'bg-gray-50 text-gray-600 border-gray-200';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Flight Bookings</h1>
              <p className="text-gray-600">Manage and schedule your flight training sessions</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
              <span className="font-medium">New Booking</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, instructor, or aircraft..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm hover:shadow"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer font-medium text-gray-700 shadow-sm hover:shadow transition-shadow min-w-[200px]"
            >
              <option value="all">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_FLIGHT">In Flight</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="WEATHER_HOLD">Weather Hold</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: bookings?.length || 0, icon: Calendar, color: 'blue', status: 'all' },
            { label: 'Scheduled', value: bookings?.filter((b: any) => b.status === 'SCHEDULED').length || 0, icon: Clock, color: 'emerald', status: 'SCHEDULED' },
            { label: 'In Flight', value: bookings?.filter((b: any) => b.status === 'IN_FLIGHT').length || 0, icon: Plane, color: 'sky', status: 'IN_FLIGHT' },
            { label: 'On Hold', value: bookings?.filter((b: any) => b.status === 'WEATHER_HOLD').length || 0, icon: AlertCircle, color: 'amber', status: 'WEATHER_HOLD' },
          ].map((stat) => (
            <button
              key={stat.label}
              onClick={() => setStatusFilter(stat.status)}
              className={`group relative bg-white rounded-xl p-6 border-2 transition-all hover:shadow-lg hover:scale-105 active:scale-95 ${
                statusFilter === stat.status ? `border-${stat.color}-500 shadow-md` : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl bg-${stat.color}-50 group-hover:bg-${stat.color}-100 transition-colors`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                {statusFilter === stat.status && (
                  <div className={`h-2 w-2 rounded-full bg-${stat.color}-500 animate-pulse`}></div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading bookings...</p>
          </div>
        ) : !filteredBookings || filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <Plane className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-8">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by scheduling your first flight'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg font-medium"
              >
                <Plus className="h-5 w-5" />
                Schedule First Flight
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking: any) => (
              <div
                key={booking.id}
                className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Date/Time Section */}
                    <div className="flex-shrink-0">
                      <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 min-w-[100px]">
                        <div className="text-2xl font-bold text-blue-900">
                          {new Date(booking.scheduledTime).getDate()}
                        </div>
                        <div className="text-xs font-medium text-blue-600 uppercase">
                          {new Date(booking.scheduledTime).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="mt-2 pt-2 border-t border-blue-200">
                          <div className="text-sm font-semibold text-blue-900">
                            {formatTime(booking.scheduledTime)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Student */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500 uppercase">Student</span>
                        </div>
                        <div className="font-semibold text-gray-900 truncate">{booking.student?.name}</div>
                        <div className="text-sm text-gray-500 truncate">{booking.student?.email}</div>
                      </div>

                      {/* Aircraft & Instructor */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Plane className="h-4 w-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500 uppercase">Aircraft</span>
                        </div>
                        <div className="font-semibold text-gray-900">{booking.aircraft?.tailNumber}</div>
                        <div className="text-sm text-gray-500">{booking.aircraft?.model}</div>
                      </div>

                      {/* Route */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500 uppercase">Route</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{booking.departureLocation?.code}</span>
                          {booking.destinationLocation && (
                            <>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                              <span className="font-semibold text-gray-900">{booking.destinationLocation.code}</span>
                            </>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Instructor: {booking.instructor?.name}
                        </div>
                      </div>
                    </div>

                    {/* Status & Action */}
                    <div className="flex-shrink-0 flex flex-col items-end gap-3">
                      {getStatusBadge(booking.status)}
                      <button className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium group-hover:bg-blue-50">
                        <span>Details</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Booking Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Schedule New Flight</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 transform"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <Plane className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Booking form coming soon...</p>
                <p className="text-sm text-gray-500">We're building an amazing booking experience for you!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
