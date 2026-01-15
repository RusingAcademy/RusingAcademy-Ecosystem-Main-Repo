import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton loading component for content placeholders
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%'),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

/**
 * Card skeleton for dashboard cards
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 ${className}`}>
    <Skeleton variant="text" height={24} width="60%" className="mb-4" />
    <Skeleton variant="text" height={16} width="80%" className="mb-2" />
    <Skeleton variant="text" height={16} width="70%" className="mb-4" />
    <Skeleton variant="rounded" height={40} width="40%" />
  </div>
);

/**
 * Table row skeleton
 */
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton variant="text" height={16} />
      </td>
    ))}
  </tr>
);

/**
 * Dashboard skeleton for full page loading
 */
export const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-8">
        <Skeleton variant="text" height={32} width={200} />
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <Skeleton variant="text" height={24} width="40%" className="mb-4" />
          <Skeleton variant="rounded" height={200} />
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <Skeleton variant="text" height={24} width="40%" className="mb-4" />
          <Skeleton variant="rounded" height={200} />
        </div>
      </div>
    </div>
  </div>
);

/**
 * AI Coach skeleton
 */
export const AICoachSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
    <div className="max-w-4xl mx-auto">
      {/* Quota widget skeleton */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <Skeleton variant="text" height={20} width={150} />
          <Skeleton variant="text" height={20} width={80} />
        </div>
        <Skeleton variant="rounded" height={8} className="mt-2" />
      </div>
      
      {/* Chat area skeleton */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 h-[500px] flex flex-col">
        <div className="flex-1 space-y-4">
          <div className="flex justify-start">
            <Skeleton variant="rounded" height={60} width="70%" />
          </div>
          <div className="flex justify-end">
            <Skeleton variant="rounded" height={40} width="50%" />
          </div>
          <div className="flex justify-start">
            <Skeleton variant="rounded" height={80} width="75%" />
          </div>
        </div>
        <Skeleton variant="rounded" height={50} className="mt-4" />
      </div>
    </div>
  </div>
);

/**
 * Pricing skeleton
 */
export const PricingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <Skeleton variant="text" height={40} width={300} className="mx-auto mb-4" />
        <Skeleton variant="text" height={20} width={500} className="mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <Skeleton variant="text" height={24} width="60%" className="mb-2" />
            <Skeleton variant="text" height={40} width="40%" className="mb-4" />
            <div className="space-y-2 mb-6">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} variant="text" height={16} />
              ))}
            </div>
            <Skeleton variant="rounded" height={48} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Skeleton;
