// Armazenamento temporário de imagens no localStorage
export const savePropertyImages = (propertyId: number, images: string[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`property_images_${propertyId}`, JSON.stringify(images))
  }
}

export const getPropertyImages = (propertyId: number): string[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`property_images_${propertyId}`)
    return stored ? JSON.parse(stored) : []
  }
  return []
}

export const removePropertyImages = (propertyId: number) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`property_images_${propertyId}`)
  }
}