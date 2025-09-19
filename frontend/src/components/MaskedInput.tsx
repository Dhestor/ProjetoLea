'use client'

import React from 'react';

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  mask?: string;
  type?: 'currency' | 'text' | 'number';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MaskedInput({ mask, type, value, onChange, ...props }: MaskedInputProps) {
  const applyMask = (value: string, mask: string) => {
    if (!mask) return value;
    
    const cleanValue = value.replace(/\D/g, '');
    let maskedValue = '';
    let valueIndex = 0;
    
    for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
      if (mask[i] === '9') {
        maskedValue += cleanValue[valueIndex];
        valueIndex++;
      } else {
        maskedValue += mask[i];
      }
    }
    
    return maskedValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (mask) {
      newValue = applyMask(newValue, mask);
    } else if (type === 'currency') {
      // Remove tudo exceto números
      newValue = newValue.replace(/\D/g, '');
      
      // Converte para formato de moeda
      if (newValue) {
        const numValue = parseInt(newValue) / 100;
        newValue = numValue.toFixed(2);
      }
    }

    if (onChange) {
      onChange({ ...e, target: { ...e.target, value: newValue } });
    }
  };

  const displayValue = type === 'currency' && value 
    ? `R$ ${parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    : value;

  return (
    <input
      {...props}
      type={type === 'currency' ? 'text' : 'text'}
      value={displayValue}
      onChange={handleChange}
      className={props.className || 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'}
    />
  );
}