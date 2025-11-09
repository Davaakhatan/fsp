import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Shield
} from 'lucide-react';
import { useSchoolSearch } from '../hooks/useMarketplace';
import { useAuth } from '../contexts/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user, userRole } = useAuth();
  const { data: schools, isLoading } = useSchoolSearch({});

  // Calculate stats
  const totalSchools = schools?.length || 0;
  const premierSchools = schools?.filter(s => s.trust_tier === 'premier').length || 0;
  const verifiedSchools = schools?.filter(s => s.trust_tier === 'verified_fsp').length || 0;
  const unverifiedSchools = schools?.filter(s => s.trust_tier === 'unverified').length || 0;

  const stats = [
    {
      label: 'Total Schools',
      value: totalSchools,
      icon: Building2,
      color: 'blue',
      change: '+2 this week',
    },
    {
      label: 'Premier Schools',
      value: premierSchools,
      icon: Shield,
      color: 'purple',
      change: `${((premierSchools / totalSchools) * 100).toFixed(0)}% of total`,
    },
    {
      label: 'Verified Schools',
      value: verifiedSchools,
      icon: CheckCircle,
      color: 'green',
      change: `${((verifiedSchools / totalSchools) * 100).toFixed(0)}% of total`,
    },
    {
      label: 'Pending Review',
      value: unverifiedSchools,
      icon: Clock,
      color: 'yellow',
      change: 'Needs attention',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Platform Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage all schools, users, and platform settings
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
                <div className="text-xs text-gray-500">Role</div>
                <div className="font-semibold text-purple-600 capitalize">{userRole}</div>
              </div>
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
                <div className="text-xs text-gray-500">User</div>
                <div className="font-semibold text-gray-900">{user?.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h3>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all">
              <Building2 className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-900">Review Schools</div>
                <div className="text-xs text-gray-500">{unverifiedSchools} pending</div>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all">
              <Users className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-900">Manage Users</div>
                <div className="text-xs text-gray-500">View all users</div>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-900">View Analytics</div>
                <div className="text-xs text-gray-500">Platform metrics</div>
              </div>
            </button>
          </div>
        </div>

        {/* All Schools Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">All Schools</h2>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
              + Add School
            </button>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading schools...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      School
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trust Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Programs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schools?.map((school) => (
                    <tr key={school.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                            {school.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{school.name}</div>
                            <div className="text-xs text-gray-500">{school.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{school.city}</div>
                        <div className="text-xs text-gray-500">{school.state}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          school.trust_tier === 'premier' ? 'bg-purple-100 text-purple-800' :
                          school.trust_tier === 'verified_fsp' ? 'bg-green-100 text-green-800' :
                          school.trust_tier === 'community_verified' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {school.trust_tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {school.avg_rating > 0 ? `${school.avg_rating.toFixed(1)}★` : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {school.total_reviews} reviews
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {school.total_programs || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          to={`/schools/${school.slug}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="h-4 w-4 inline" />
                        </Link>
                        <button className="text-purple-600 hover:text-purple-900">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

