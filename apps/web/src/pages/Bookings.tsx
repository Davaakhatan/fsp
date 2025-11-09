import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Plane, 
  Clock, 
  Users,
  MapPin,
  ChevronRight,
  X
} from 'lucide-react';
import { useBookings } from '../hooks/useApi';
import { formatTime } from '@fsp/shared';

export default function Bookings() {
  const { data: bookings, isLoading } = useBookings();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter bookings based on search and status
  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = 
      booking.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.instructor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.aircraft?.tailNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  // Stats
  const stats = {
    total: bookings?.length || 0,
    scheduled: bookings?.filter(b => b.status === 'SCHEDULED').length || 0,
    inFlight: bookings?.filter(b => b.status === 'IN_FLIGHT').length || 0,
    onHold: bookings?.filter(b => b.status === 'ON_HOLD').length || 0,
  };

  const getStatusStyle = (status: string) => {
    const styles = {
      SCHEDULED: 'bg-blue-50 text-blue-700 border-blue-200',
      IN_FLIGHT: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      COMPLETED: 'bg-gray-50 text-gray-700 border-gray-200',
      CANCELLED: 'bg-red-50 text-red-700 border-red-200',
      ON_HOLD: 'bg-orange-50 text-orange-700 border-orange-200',
    }[status] || 'bg-gray-50 text-gray-700 border-gray-200';

    return styles;
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Calendar className="h-5 w-5" />
            New Booking
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total', value: stats.total, icon: Calendar, color: 'blue', active: statusFilter === 'ALL', filter: 'ALL' },
          { label: 'Scheduled', value: stats.scheduled, icon: Clock, color: 'blue', active: statusFilter === 'SCHEDULED', filter: 'SCHEDULED' },
          { label: 'In Flight', value: stats.inFlight, icon: Plane, color: 'emerald', active: statusFilter === 'IN_FLIGHT', filter: 'IN_FLIGHT' },
          { label: 'On Hold', value: stats.onHold, icon: Clock, color: 'orange', active: statusFilter === 'ON_HOLD', filter: 'ON_HOLD' },
        ].map((stat, index) => (
          <button
            key={index}
            onClick={() => setStatusFilter(stat.filter)}
            className={`group relative bg-white rounded-2xl p-6 border transition-all hover:shadow-xl text-left overflow-hidden ${
              stat.active ? 'border-blue-500 shadow-lg ring-2 ring-blue-100' : 'border-gray-200'
            }`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
            
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

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student, instructor, or aircraft..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium">
          <Filter className="h-5 w-5 text-gray-600" />
          All Status
        </button>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Plane className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking: any) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-xl group overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-6">
                  {/* Date Badge */}
                  <div className="flex-shrink-0">
                    <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 min-w-[80px] group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                      <div className="text-2xl font-bold text-blue-900">
                        {new Date(booking.scheduledTime).getDate()}
                      </div>
                      <div className="text-xs font-medium text-blue-600 uppercase">
                        {new Date(booking.scheduledTime).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-xs text-blue-700 mt-1 font-medium">
                        {formatTime(booking.scheduledTime)}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{booking.student?.name}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Plane className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Aircraft</div>
                          <div className="font-medium text-gray-900">{booking.aircraft?.tailNumber}</div>
                          <div className="text-xs text-gray-500">{booking.aircraft?.model}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Instructor</div>
                          <div className="font-medium text-gray-900">{booking.instructor?.name}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Route</div>
                          <div className="font-medium text-gray-900">{booking.route || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <button className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors group/btn">
                      <span>Details</span>
                      <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
