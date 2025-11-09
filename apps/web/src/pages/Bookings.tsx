import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Plane, 
  Clock, 
  Users,
  MapPin,
  ChevronRight,
  X,
  Save,
  Loader2
} from 'lucide-react';
import { useBookings } from '../hooks/useApi';
import { formatTime } from '@fsp/shared';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ToastProvider';

export default function Bookings() {
  const { data: bookings, isLoading, refetch } = useBookings();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    instructorId: '',
    aircraftId: '',
    scheduledTime: '',
    departureLocationId: '',
    arrivalLocationId: '',
    route: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Lookup data
  const [students, setStudents] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [aircraft, setAircraft] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch lookup data when modal opens
  useEffect(() => {
    if (showCreateModal) {
      fetchLookupData();
    }
  }, [showCreateModal]);

  const fetchLookupData = async () => {
    setDataLoading(true);
    try {
      const [studentsRes, instructorsRes, aircraftRes, locationsRes] = await Promise.all([
        supabase.from('students').select('*').order('name'),
        supabase.from('instructors').select('*').order('name'),
        supabase.from('aircraft').select('*').order('tail_number'),
        supabase.from('locations').select('*').order('name'),
      ]);

      if (studentsRes.data) setStudents(studentsRes.data);
      if (instructorsRes.data) setInstructors(instructorsRes.data);
      if (aircraftRes.data) setAircraft(aircraftRes.data);
      if (locationsRes.data) setLocations(locationsRes.data);
    } catch (error) {
      console.error('Error fetching lookup data:', error);
      setFormError('Failed to load form data. Please try again.');
      showToast('error', 'Failed to load form data');
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      // Validate required fields
      if (!formData.studentId || !formData.instructorId || !formData.aircraftId || 
          !formData.scheduledTime || !formData.departureLocationId) {
        setFormError('Please fill in all required fields');
        setFormLoading(false);
        return;
      }

      // Create booking
      const { data, error } = await supabase
        .from('flight_bookings')
        .insert([
          {
            student_id: formData.studentId,
            instructor_id: formData.instructorId,
            aircraft_id: formData.aircraftId,
            scheduled_time: formData.scheduledTime,
            departure_location_id: formData.departureLocationId,
            arrival_location_id: formData.arrivalLocationId || formData.departureLocationId,
            route: formData.route || null,
            status: 'SCHEDULED',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Success - close modal and refetch data
      showToast('success', 'Flight booking created successfully!');
      setShowCreateModal(false);
      refetch();
      
      // Reset form
      setFormData({
        studentId: '',
        instructorId: '',
        aircraftId: '',
        scheduledTime: '',
        departureLocationId: '',
        arrivalLocationId: '',
        route: '',
      });
    } catch (error: any) {
      console.error('Error creating booking:', error);
      const errorMsg = error.message || 'Failed to create booking. Please try again.';
      setFormError(errorMsg);
      showToast('error', errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

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
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 z-10">
              <h2 className="text-2xl font-bold text-gray-900">Schedule New Flight</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 transform"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {formError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-800">{formError}</p>
                </div>
              )}

              {dataLoading ? (
                <div className="py-12 text-center">
                  <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Loading form data...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Student Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select a student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.training_level})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Instructor Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructor <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.instructorId}
                      onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select an instructor</option>
                      {instructors.map((instructor) => (
                        <option key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Aircraft Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aircraft <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.aircraftId}
                      onChange={(e) => setFormData({ ...formData, aircraftId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select an aircraft</option>
                      {aircraft.map((ac) => (
                        <option key={ac.id} value={ac.id}>
                          {ac.tail_number} - {ac.model}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Scheduled Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Date & Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Select date and time for your flight lesson
                    </p>
                  </div>
                  </div>

                  {/* Departure Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departure Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.departureLocationId}
                      onChange={(e) => setFormData({ ...formData, departureLocationId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select departure location</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.icao_code} - {location.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Arrival Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arrival Location (optional)
                    </label>
                    <select
                      value={formData.arrivalLocationId}
                      onChange={(e) => setFormData({ ...formData, arrivalLocationId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Same as departure (local flight)</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.icao_code} - {location.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Route */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Route / Notes (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.route}
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                      placeholder="e.g., Local area, pattern work, cross-country"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          Create Booking
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      disabled={formLoading}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
