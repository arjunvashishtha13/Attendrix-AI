import React from 'react';

const LoadingSpinner = ({ label = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-attendrix-rose border-t-transparent" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">{content}</div>
    );
  }

  return <div className="flex justify-center py-12">{content}</div>;
};

export default LoadingSpinner;
