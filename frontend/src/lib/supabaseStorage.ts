import { supabase } from './supabase'

export const uploadPropertyImage = async (file: File, propertyId: number, index: number): Promise<string | null> => {
  try {
    console.log('Iniciando upload:', file.name, 'Tamanho:', file.size)
    console.log('Supabase URL:', supabase.supabaseUrl)
    console.log('Supabase Key:', supabase.supabaseKey?.substring(0, 20) + '...')
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${propertyId}_${index}_${Date.now()}.${fileExt}`
    
    console.log('Nome do arquivo:', fileName)
    
    // Tentar upload com configurações mínimas
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(fileName, file)

    if (error) {
      console.error('Erro detalhado no upload:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error
      })
      return null
    }

    console.log('Upload realizado:', data)

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName)

    console.log('URL pública:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('Erro no upload:', error)
    return null
  }
}

export const uploadMultipleImages = async (files: File[], propertyId: number): Promise<string[]> => {
  console.log('Iniciando upload múltiplo:', files.length, 'arquivos para propriedade', propertyId)
  
  const results: string[] = []
  
  for (let i = 0; i < files.length; i++) {
    const url = await uploadPropertyImage(files[i], propertyId, i)
    if (url) {
      results.push(url)
    }
  }
  
  console.log('Upload concluído:', results.length, 'de', files.length, 'imagens')
  return results
}