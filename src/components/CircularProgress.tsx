interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  showPercentage?: boolean;
}

export const CircularProgress = ({
  percentage,
  size = 120,
  strokeWidth = 4,
  children,
  showPercentage = true,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;

  // Keep the extended circle
  const totalDegrees = 320;
  const circumference = (2 * Math.PI * radius * totalDegrees) / 360;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform rotate-[110deg]">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${2 * Math.PI * radius}`}
            strokeLinecap="round"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#10B981"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${2 * Math.PI * radius}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
      {showPercentage && (
        <div className="text-xs font-semibold text-[#10B981]">
          {percentage}%
        </div>
      )}
    </div>
  );
};
