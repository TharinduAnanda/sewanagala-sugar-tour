'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import axios from 'axios'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  FaImage, FaVideo, FaUpload, FaTrash, FaEye, FaIndustry
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
  const [adminEmail, setAdminEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    const email = localStorage.getItem('adminUser')
    if (email) {
      try {
        const user = JSON.parse(email)
        setAdminEmail(user.email || user.username)
      } catch {
        setAdminEmail(email)
      }
    }
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
        fetchStationMedia(selectedStation.id)
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

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <AdminLayout 
        title="Station Media" 
        description="Loading..."
        adminEmail={adminEmail}
        onLogout={handleLogout}
      >
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading stations...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout 
      title="Station Media Management" 
      description="Upload and manage photos & videos for tour stations using Cloudinary"
      adminEmail={adminEmail}
      onLogout={handleLogout}
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stations List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaIndustry className="text-primary" />
                Select Station
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {stations.map((station) => (
                  <motion.div
                    key={station.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedStation(station)}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all",
                      selectedStation?.id === station.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="font-semibold">
                      Station {station.station_number}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {station.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upload & Media Display */}
        <div className="lg:col-span-2">
          {selectedStation ? (
            <>
              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>
                      Upload Media - Station {selectedStation.station_number}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="file-input">Select File</Label>
                        <Input
                          id="file-input"
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                          className="mt-2"
                        />
                        {file && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Selected: {file.name} ({mediaType})
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="caption">Caption (Optional)</Label>
                        <Textarea
                          id="caption"
                          placeholder="Add a caption for this media..."
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                          rows={2}
                          className="mt-2"
                        />
                      </div>

                      <Button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="w-full"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <FaUpload className="mr-2" />
                            Upload to Cloudinary
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Media Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Media Gallery ({media.length} items)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {media.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <FaImage className="mx-auto text-4xl mb-4 opacity-30" />
                        <p>No media uploaded yet for this station</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {media.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            className="relative group"
                          >
                            <div className="aspect-video bg-accent rounded-lg overflow-hidden border">
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
                              <p className="text-sm text-muted-foreground mt-2 truncate">
                                {item.caption}
                              </p>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <a
                                href={item.media_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button size="sm" variant="outline" className="bg-background">
                                  <FaEye />
                                </Button>
                              </a>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-background text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(item.id)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-1 bg-black/50 text-white text-xs rounded flex items-center gap-1">
                                {item.media_type === 'image' ? <FaImage /> : <FaVideo />}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <FaImage className="mx-auto text-6xl mb-4 opacity-30" />
                    <p className="text-lg">Select a station to manage its media</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

