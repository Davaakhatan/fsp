import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, User, Calendar, MessageSquare, CheckCircle, Clock, XCircle, Filter } from 'lucide-react';
import { formatDateTime } from '../lib/utils';

interface Inquiry {
  id: string;
  student_name: string;
  student_email: string;
  student_phone: string | null;
  program_interest: string | null;
  message: string;
  status: string;
  created_at: string;
  school: {
    id: string;
    name: string;
  };
}

export default function Inquiries() {
  const { schoolId, isAdmin } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch inquiries
  const { data: inquiries, isLoading, refetch } = useQuery({
    queryKey: ['inquiries', schoolId, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('inquiries')
        .select(`
          *,
          school:schools(id, name)
        `)
        .order('created_at', { ascending: false });

      // Filter by school if not platform admin
      if (!isAdmin && schoolId) {
        query = query.eq('school_id', schoolId);
      }

      // Filter by status
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Inquiry[];
    },
    enabled: !!schoolId || isAdmin,
  });

  const updateStatus = async (inquiryId: string, newStatus: string) => {
    const { error } = await supabase
      .from('inquiries')
      .update({ status: newStatus })
      .eq('id', inquiryId);

    if (!error) {
      refetch();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'contacted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'converted':
        return <CheckCircle className="h-5 w-5 text-purple-600" />;
      case 'closed':
        return <XCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      contacted: 'bg-green-100 text-green-800 border-green-200',
      converted: 'bg-purple-100 text-purple-800 border-purple-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return styles[status as keyof typeof styles] || styles.new;
  };

  if (!schoolId && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No School Linked</h2>
          <p className="text-gray-600">
            Your account is not linked to a school yet. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Inquiries</h1>
          <p className="text-gray-600">Manage inquiries from prospective students</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', status: 'all', count: inquiries?.length || 0, color: 'blue' },
            { label: 'New', status: 'new', count: inquiries?.filter(i => i.status === 'new').length || 0, color: 'blue' },
            { label: 'Contacted', status: 'contacted', count: inquiries?.filter(i => i.status === 'contacted').length || 0, color: 'green' },
            { label: 'Converted', status: 'converted', count: inquiries?.filter(i => i.status === 'converted').length || 0, color: 'purple' },
          ].map((stat) => (
            <button
              key={stat.status}
              onClick={() => setStatusFilter(stat.status)}
              className={`bg-white rounded-xl p-6 border-2 transition-all hover:shadow-lg ${
                statusFilter === stat.status
                  ? `border-${stat.color}-500 shadow-lg`
                  : 'border-gray-200'
              }`}
            >
              <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
              <div className={`text-3xl font-bold text-${stat.color}-600`}>{stat.count}</div>
            </button>
          ))}
        </div>

        {/* Inquiries List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : inquiries && inquiries.length > 0 ? (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      {getStatusIcon(inquiry.status)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{inquiry.student_name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {inquiry.student_email}
                        </span>
                        {inquiry.student_phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {inquiry.student_phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDateTime(new Date(inquiry.created_at))}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadge(inquiry.status)}`}>
                    {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                  </span>
                </div>

                {inquiry.program_interest && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700">Interested in: </span>
                    <span className="text-sm text-gray-600">{inquiry.program_interest.toUpperCase()}</span>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Message:</p>
                  <p className="text-gray-800">{inquiry.message}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {inquiry.status === 'new' && (
                    <button
                      onClick={() => updateStatus(inquiry.id, 'contacted')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Mark as Contacted
                    </button>
                  )}
                  {inquiry.status === 'contacted' && (
                    <button
                      onClick={() => updateStatus(inquiry.id, 'converted')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Mark as Converted
                    </button>
                  )}
                  {inquiry.status !== 'closed' && (
                    <button
                      onClick={() => updateStatus(inquiry.id, 'closed')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      Close
                    </button>
                  )}
                  <a
                    href={`mailto:${inquiry.student_email}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Inquiries Yet</h3>
            <p className="text-gray-600">
              {statusFilter === 'all'
                ? 'When students contact your school, their inquiries will appear here.'
                : `No inquiries with status "${statusFilter}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

