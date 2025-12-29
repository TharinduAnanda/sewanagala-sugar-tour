'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaPlay } from 'react-icons/fa'
import { MediaItem } from '@/types'
import Image from 'next/image'

interface MediaViewerProps {
  media: MediaItem[]
}

export default function MediaViewer({ media }: MediaViewerProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  if (!media || media.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No media available for this station</p>
      </div>
    )
  }

  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item)
  }

  const closeModal = () => {
    setSelectedMedia(null)
  }

  return (
    <div className="media-viewer">
      <h3 className="text-2xl font-bold mb-4">Media Gallery</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <motion.div
            key={item.id}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => handleMediaClick(item)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.media_type === 'image' ? (
              <Image
                src={item.media_url}
                alt={item.title || 'Station media'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  src={item.media_url}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <FaPlay className="text-white text-4xl" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              {item.title && (
                <p className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium">
                  {item.title}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative max-w-4xl w-full bg-background rounded-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                onClick={closeModal}
              >
                <FaTimes className="text-xl" />
              </button>

              {selectedMedia.media_type === 'image' ? (
                <div className="relative w-full aspect-video">
                  <Image
                    src={selectedMedia.media_url}
                    alt={selectedMedia.title || 'Media'}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <video
                  src={selectedMedia.media_url}
                  controls
                  autoPlay
                  className="w-full"
                />
              )}

              {(selectedMedia.title || selectedMedia.description) && (
                <div className="p-6">
                  {selectedMedia.title && (
                    <h4 className="text-xl font-bold mb-2">{selectedMedia.title}</h4>
                  )}
                  {selectedMedia.description && (
                    <p className="text-muted-foreground">{selectedMedia.description}</p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
