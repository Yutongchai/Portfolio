import React from 'react';

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`text-center mb-24 ${className}`}>
      <h2 className="text-5xl font-black text-[#23242b] mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 font-medium max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
};

export default PageHeader;
