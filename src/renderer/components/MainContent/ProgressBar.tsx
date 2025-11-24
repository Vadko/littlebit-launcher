import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number;
  color: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, color }) => {
  return (
    <div className="progress-wrapper">
      <div className="progress-meta">
        <span className="progress-label">{label}</span>
        <span className="progress-value">{value}%</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-bar"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      </div>
    </div>
  );
};
