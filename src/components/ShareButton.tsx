'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaShare, FaFacebook, FaTwitter, FaWhatsapp, FaLink } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ShareButtonProps {
  url?: string
  title?: string
  description?: string
}

export default function ShareButton({ url, title, description }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareTitle = title || 'Sewanagala Sugar Factory Tour'
  const shareText = description || 'Check out this amazing factory tour!'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <FaShare className="mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => window.open(shareLinks.facebook, '_blank')}>
          <FaFacebook className="mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(shareLinks.twitter, '_blank')}>
          <FaTwitter className="mr-2" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(shareLinks.whatsapp, '_blank')}>
          <FaWhatsapp className="mr-2" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard}>
          <FaLink className="mr-2" />
          {copied ? 'Copied!' : 'Copy Link'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
