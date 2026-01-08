// Cloudinary upload utility for special booking documents

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  original_filename: string
  bytes: number
  format: string
  resource_type: string
}

export async function uploadToCloudinary(
  file: File,
  folder: string = 'special-bookings'
): Promise<CloudinaryUploadResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'ml_default') // You'll need to create this in Cloudinary
  formData.append('folder', folder)

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djy8hclco'

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return {
      public_id: data.public_id,
      secure_url: data.secure_url,
      original_filename: data.original_filename,
      bytes: data.bytes,
      format: data.format,
      resource_type: data.resource_type,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

export function getCloudinaryUrl(publicId: string, options?: {
  width?: number
  height?: number
  crop?: string
  quality?: string
}): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djy8hclco'
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`
  
  let transformations = []
  if (options?.width) transformations.push(`w_${options.width}`)
  if (options?.height) transformations.push(`h_${options.height}`)
  if (options?.crop) transformations.push(`c_${options.crop}`)
  if (options?.quality) transformations.push(`q_${options.quality}`)
  
  const transformString = transformations.length > 0 ? transformations.join(',') + '/' : ''
  
  return `${baseUrl}/${transformString}${publicId}`
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    })
    
    return response.ok
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return false
  }
}
