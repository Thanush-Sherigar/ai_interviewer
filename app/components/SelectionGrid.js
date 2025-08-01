import { useState } from 'react';

export default function SelectionGrid({ 
  options, 
  value, 
  onChange, 
  title,
  multiple = false,
  className = ''
}) {
  return (
    <div className={`mb-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => (
          <SelectionCard
            key={option.value}
            option={option}
            selected={multiple ? value.includes(option.value) : value === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
}

function SelectionCard({ option, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
        ${selected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className={`font-medium ${selected ? 'text-blue-900' : 'text-gray-900'}`}>
            {option.label}
          </h4>
          {option.description && (
            <p className={`text-sm mt-1 ${selected ? 'text-blue-700' : 'text-gray-600'}`}>
              {option.description}
            </p>
          )}
        </div>
        {option.icon && (
          <div className={`text-2xl ${selected ? 'text-blue-600' : 'text-gray-400'}`}>
            {option.icon}
          </div>
        )}
      </div>
      
      {selected && (
        <div className="absolute top-2 right-2">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
