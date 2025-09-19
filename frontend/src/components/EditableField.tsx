'use client'

import { useState } from 'react'
import { sanitizeInput } from '@/lib/sanitize'

interface EditableFieldProps {
  field: string
  value: string | number
  label: string
  type?: string
  onSave: (field: string, value: string) => void
}

export default function EditableField({ field, value, label, type = 'text', onSave }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(value))

  const handleSave = () => {
    const sanitizedValue = sanitizeInput(editValue)
    onSave(field, sanitizedValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(String(value))
    setIsEditing(false)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val)
  }

  return (
    <div className="flex items-center justify-between group">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="p-2 text-green-600 hover:bg-green-50 rounded"
            >
              <i className="fas fa-check"></i>
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ) : (
          <p className="mt-1 text-gray-900">
            {type === 'currency' ? formatCurrency(Number(value)) : value}
          </p>
        )}
      </div>
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 p-2 text-blue-600 hover:bg-blue-50 rounded transition-opacity"
        >
          <i className="fas fa-edit"></i>
        </button>
      )}
    </div>
  )
}