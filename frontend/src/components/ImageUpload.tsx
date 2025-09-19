'use client'

import { useState } from 'react'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  files?: File[]
  onFilesChange?: (files: File[]) => void
}

export default function ImageUpload({ images, onImagesChange, files = [], onFilesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [originalFiles, setOriginalFiles] = useState<File[]>(files)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    const fileArray = Array.from(files)
    
    // Validar tamanho dos arquivos
    const maxSize = 5 * 1024 * 1024 // 5MB
    const oversizedFiles = fileArray.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      alert(`Algumas imagens são muito grandes. Tamanho máximo: 5MB`)
      setUploading(false)
      e.target.value = ''
      return
    }

    // Converter para base64 para preview
    const promises = fileArray.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          resolve(event.target?.result as string)
        }
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
        reader.readAsDataURL(file)
      })
    })

    try {
      const newImages = await Promise.all(promises)
      const updatedFiles = [...originalFiles, ...fileArray]
      
      setOriginalFiles(updatedFiles)
      onImagesChange([...images, ...newImages])
      onFilesChange?.(updatedFiles)
    } catch (error) {
      console.error('Erro ao carregar imagens:', error)
      alert('Erro ao carregar imagens')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    const updatedFiles = originalFiles.filter((_, i) => i !== index)
    
    setOriginalFiles(updatedFiles)
    onImagesChange(updatedImages)
    onFilesChange?.(updatedFiles)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images]
    const updatedFiles = [...originalFiles]
    
    const [movedImage] = updatedImages.splice(fromIndex, 1)
    const [movedFile] = updatedFiles.splice(fromIndex, 1)
    
    updatedImages.splice(toIndex, 0, movedImage)
    updatedFiles.splice(toIndex, 0, movedFile)
    
    setOriginalFiles(updatedFiles)
    onImagesChange(updatedImages)
    onFilesChange?.(updatedFiles)
  }

  return (
    <div className="space-y-4">
      {/* Imagens existentes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Imagem ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              
              {/* Badge da foto principal */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Principal
                </div>
              )}
              
              {/* Controles */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70"
                    title="Mover para esquerda"
                  >
                    <i className="fas fa-chevron-left text-xs"></i>
                  </button>
                )}
                
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70"
                    title="Mover para direita"
                  >
                    <i className="fas fa-chevron-right text-xs"></i>
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                  title="Remover imagem"
                >
                  <i className="fas fa-trash text-xs"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão para adicionar nova imagem */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        <label
          htmlFor="image-upload"
          className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}
        >
          <div className="flex flex-col items-center">
            <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
            <p className="text-gray-600 font-medium">
              {uploading ? 'Carregando...' : 'Clique para adicionar fotos'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {images.length === 0 ? 'A primeira foto será a principal' : 'Adicionar mais fotos'}
            </p>
          </div>
        </label>
      </div>

      {/* Informações */}
      {images.length > 0 && (
        <div className="text-sm text-gray-500">
          <p>• A primeira imagem será exibida no card de listagem</p>
          <p>• Use as setas para reordenar as imagens</p>
          <p>• Total: {images.length} imagem{images.length !== 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  )
}