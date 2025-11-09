import Layout from '@/components/Layout';

export default function Bookings() {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-500 mt-1">
            Manage flight bookings and schedules
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Coming soon...</p>
        </div>
      </div>
    </Layout>
  );
}

