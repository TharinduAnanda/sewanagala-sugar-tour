'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { 
  FaArrowLeft, FaImage, FaVideo, FaUpload, FaTrash, FaEye, FaPlus
} from 'react-icons/fa'

interface Station {
  id: number
  station_number: number
  name: string
  description: string
  latitude?: number
  longitude?: number
}

interface Media {
  id: number
  station_id: number
  media_type: string
  media_url: string
  caption?: string
  upload_date: string
}

export default function AdminStationsPage() {
  const [stations, setStations] = useState<Station[]>([])
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [caption, setCaption] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchStations()
  }, [])

  useEffect(() => {
    if (selectedStation) {
      fetchStationMedia(selectedStation.id)
    }
  }, [selectedStation])

  const fetchStations = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await axios.get('/api/stations')
      if (response.data.success) {
        setStations(response.data.data)
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/admin/login')
      } else {
        setError('Failed to fetch stations')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchStationMedia = async (stationId: number) => {
    try {
      const response = await axios.get(`/api/stations/${stationId}/media`)
      if (response.data.success) {
        setMedia(response.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch media:', err)
      setMedia([])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      
      // Auto-detect media type
      if (selectedFile.type.startsWith('video/')) {
        setMediaType('video')
      } else {
        setMediaType('image')
      }
    }
  }

  const handleUpload = async () => {
    if (!file || !selectedStation) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('media_type', mediaType)
      formData.append('caption', caption)

      const response = await axios.post(
        `/api/stations/${selectedStation.id}/media`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.data.success) {
        // Refresh media list
        fetchStationMedia(selectedStation.id)
        // Reset form
        setFile(null)
        setCaption('')
        const fileInput = document.getElementById('file-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
    } catch (err: any) {
      setError('Failed to upload media: ' + (err.response?.data?.message || err.message))
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (mediaId: number) => {
    if (!confirm('Are you sure you want to delete this media?')) return

    try {
      const response = await axios.delete(
        `/api/stations/${selectedStation?.id}/media?mediaId=${mediaId}`
      )

      if (response.data.success) {
        fetchStationMedia(selectedStation!.id)
      }
    } catch (err) {
      setError('Failed to delete media')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <FaArrowLeft className="mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Station Media Management</h1>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stations List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select Station</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stations.map((station) => (
                    <motion.div
                      key={station.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedStation(station)}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${selectedStation?.id === station.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 bg-white hover:border-blue-300'}
                      `}
                    >
                      <div className="font-semibold text-gray-900">
                        Station {station.station_number}: {station.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 truncate">
                        {station.description}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload & Media Display */}
          <div className="lg:col-span-2">
            {selectedStation ? (
              <>
                {/* Upload Section */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>
                      Upload Media for Station {selectedStation.station_number}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Select File
                        </label>
                        <Input
                          id="file-input"
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                        />
                        {file && (
                          <p className="text-sm text-gray-600 mt-2">
                            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Media Type
                        </label>
                        <select
                          value={mediaType}
                          onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Caption (Optional)
                        </label>
                        <Input
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                          placeholder="Enter caption..."
                        />
                      </div>

                      <Button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="w-full"
                      >
                        {uploading ? (
                          <>Uploading...</>
                        ) : (
                          <>
                            <FaUpload className="mr-2" />
                            Upload Media
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Media Gallery */}
                <Card>
                  <CardHeader>
                    <CardTitle>Media Gallery ({media.length} items)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {media.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No media uploaded yet for this station
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {media.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group"
                          >
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              {item.media_type === 'image' ? (
                                <img
                                  src={item.media_url}
                                  alt={item.caption || 'Station media'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video
                                  src={item.media_url}
                                  className="w-full h-full object-cover"
                                  controls
                                />
                              )}
                            </div>
                            {item.caption && (
                              <p className="text-sm text-gray-600 mt-2 truncate">
                                {item.caption}
                              </p>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <a
                                href={item.media_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button size="sm" variant="outline" className="bg-white">
                                  <FaEye />
                                </Button>
                              </a>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-white text-red-600"
                                onClick={() => handleDelete(item.id)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                                {item.media_type === 'image' ? <FaImage /> : <FaVideo />}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <FaImage className="mx-auto text-4xl mb-4 text-gray-300" />
                    <p>Select a station to manage its media</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
