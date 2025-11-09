import React from 'react';
import { Shield, Star, Users, AlertCircle } from 'lucide-react';
import type { TrustTier } from '@fsp/shared';

interface TrustBadgeProps {
  tier: TrustTier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTooltip?: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ 
  tier, 
  size = 'md', 
  showLabel = true,
  showTooltip = true 
}) => {
  const config = {
    premier: {
      icon: Star,
      label: 'Premier Flight School',
      emoji: '🥇',
      color: 'from-yellow-400 to-orange-500',
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-800',
      description: 'Meets or exceeds composite benchmarks for training velocity, schedule reliability, and student satisfaction.',
    },
    verified_fsp: {
      icon: Shield,
      label: 'Verified FSP School',
      emoji: '✅',
      color: 'from-green-400 to-emerald-500',
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-800',
      description: 'Profile facts are automatically cross-checked against FSP aggregated operational data.',
    },
    community_verified: {
      icon: Users,
      label: 'Community Verified',
      emoji: '🤝',
      color: 'from-blue-400 to-indigo-500',
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-800',
      description: 'School has claimed its profile, verified business documentation, and provides periodic attestation.',
    },
    unverified: {
      icon: AlertCircle,
      label: 'Unverified',
      emoji: '',
      color: 'from-gray-400 to-gray-500',
      bg: 'bg-gray-50',
      border: 'border-gray-300',
      text: 'text-gray-600',
      description: 'School data discovered via crawling with no human or independent verification.',
    },
  };

  const { icon: Icon, label, emoji, color, bg, border, text, description } = config[tier];

  const sizeClasses = {
    sm: {
      badge: 'px-2 py-1 text-xs',
      icon: 'h-3 w-3',
      emoji: 'text-sm',
    },
    md: {
      badge: 'px-3 py-1.5 text-sm',
      icon: 'h-4 w-4',
      emoji: 'text-base',
    },
    lg: {
      badge: 'px-4 py-2 text-base',
      icon: 'h-5 w-5',
      emoji: 'text-lg',
    },
  };

  const badge = (
    <div 
      className={`inline-flex items-center space-x-2 ${bg} ${border} border rounded-full font-medium ${text} ${sizeClasses[size].badge} transition-all hover:shadow-md`}
      title={showTooltip ? description : undefined}
    >
      {emoji && <span className={sizeClasses[size].emoji}>{emoji}</span>}
      <Icon className={sizeClasses[size].icon} />
      {showLabel && <span>{label}</span>}
    </div>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <div className="group relative inline-block">
      {badge}
      {/* Tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className={`${bg} ${border} border rounded-xl p-4 shadow-xl`}>
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-8 h-8 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">{label}</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

