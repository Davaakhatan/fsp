import Layout from '@/components/Layout';
import { AlertCircle, Cloud, Plane, Users } from 'lucide-react';

export default function Dashboard() {
  // Mock data - will be replaced with real data later
  const stats = [
    { label: 'Active Flights', value: '12', icon: Plane, trend: '+2' },
    { label: 'Weather Alerts', value: '3', icon: AlertCircle, trend: '-1' },
    { label: 'Scheduled Today', value: '18', icon: Users, trend: '+4' },
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
          {stats.map((stat) => {
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
          <h3 className="text-xl font-semibold text-gray-900">
            Active Weather Alerts
          </h3>
          
          {/* Empty state - will show alerts when available */}
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
        </section>

        {/* Upcoming Flights */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Upcoming Flights
          </h3>
          
          {/* Empty state */}
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
        </section>
      </div>
    </Layout>
  );
}

