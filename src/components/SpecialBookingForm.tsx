'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FaUpload, FaTrash, FaFileAlt, FaExclamationTriangle } from 'react-icons/fa'
import { uploadToCloudinary } from '@/lib/cloudinaryUpload'

interface SpecialBookingFormProps {
  requestedCapacity: number
  onCapacityChange: (capacity: number) => void
  specialReason: string
  onReasonChange: (reason: string) => void
  documents: Array<{
    name: string
    url: string
    publicId: string
    size: number
    type: string
  }>
  onDocumentsChange: (documents: any[]) => void
}

export default function SpecialBookingForm({
  requestedCapacity,
  onCapacityChange,
  specialReason,
  onReasonChange,
  documents,
  onDocumentsChange,
}: SpecialBookingFormProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadProgress('Uploading...')

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Max size is 10MB.`)
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File ${file.name} type not allowed. Only PDF and images are accepted.`)
        }

        setUploadProgress(`Uploading ${file.name}...`)
        const result = await uploadToCloudinary(file, 'special-bookings')

        return {
          name: file.name,
          url: result.secure_url,
          publicId: result.public_id,
          size: result.bytes,
          type: file.type,
        }
      })

      const uploadedDocs = await Promise.all(uploadPromises)
      onDocumentsChange([...documents, ...uploadedDocs])
      setUploadProgress('Upload complete!')
      
      setTimeout(() => setUploadProgress(''), 2000)
    } catch (error: any) {
      console.error('Upload error:', error)
      setUploadProgress(`Error: ${error.message}`)
      setTimeout(() => setUploadProgress(''), 3000)
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleRemoveDocument = (index: number) => {
    const newDocuments = documents.filter((_, i) => i !== index)
    onDocumentsChange(newDocuments)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <Card className="border-amber-500/30 bg-amber-50/50">
      <CardContent className="p-6 space-y-6">
        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-4 bg-amber-100 border border-amber-300 rounded-lg">
          <FaExclamationTriangle className="text-amber-600 mt-0.5 flex-shrink-0" size={20} />
          <div className="text-sm">
            <p className="font-semibold text-amber-900 mb-1">Special Booking Request</p>
            <p className="text-amber-800">
              You are requesting more than 100 visitors per time slot. This requires admin approval 
              and supporting documentation.
            </p>
          </div>
        </div>

        {/* Requested Capacity */}
        <div className="space-y-2">
          <Label htmlFor="requested_capacity" className="text-base font-semibold">
            Requested Capacity <span className="text-red-500">*</span>
          </Label>
          <Input
            id="requested_capacity"
            type="number"
            min="101"
            max="1000"
            value={requestedCapacity}
            onChange={(e) => onCapacityChange(parseInt(e.target.value) || 101)}
            className="text-lg"
            required
          />
          <p className="text-sm text-gray-600">
            Total number of visitors (must be more than 100)
          </p>
        </div>

        {/* Special Request Reason */}
        <div className="space-y-2">
          <Label htmlFor="special_reason" className="text-base font-semibold">
            Reason for Special Request <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="special_reason"
            value={specialReason}
            onChange={(e) => onReasonChange(e.target.value)}
            rows={4}
            placeholder="Please provide detailed information about your organization, purpose of visit, and why you need capacity over 100 visitors..."
            className="resize-none"
            required
          />
          <p className="text-sm text-gray-600">
            Include: Organization name, event purpose, expected group composition, visit objectives
          </p>
        </div>

        {/* Document Upload */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Supporting Documents <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-gray-600">
            Upload official letters, authorization documents, permits, or other relevant documents 
            (PDF, JPG, PNG - Max 10MB per file)
          </p>

          {/* Upload Button */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="relative"
              disabled={uploading}
            >
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={uploading}
              />
              <FaUpload className="mr-2" />
              {uploading ? 'Uploading...' : 'Upload Documents'}
            </Button>
            {uploadProgress && (
              <span className="text-sm text-gray-600">{uploadProgress}</span>
            )}
          </div>

          {/* Uploaded Documents List */}
          {documents.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-sm font-medium">Uploaded Documents ({documents.length}):</p>
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FaFileAlt className="text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View
                    </a>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDocument(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <FaTrash size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {documents.length === 0 && (
            <p className="text-sm text-red-500 mt-2">
              At least one supporting document is required for special bookings
            </p>
          )}
        </div>

        {/* Important Notice */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Important:</strong> Your booking will be marked as "Pending" and requires admin approval. 
            You will receive an SMS and email notification once your request is reviewed. 
            Please ensure all information is accurate and complete.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
