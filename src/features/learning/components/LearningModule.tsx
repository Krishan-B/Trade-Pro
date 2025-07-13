import React from 'react';

interface LearningModuleProps {
  title: string;
  children: React.ReactNode;
}

const LearningModule: React.FC<LearningModuleProps> = ({ title, children }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default LearningModule;