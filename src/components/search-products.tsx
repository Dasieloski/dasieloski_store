'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"

interface SearchProductsProps {
  onSearch: (term: string) => void
}

export function SearchProducts({ onSearch }: SearchProductsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    onSearch(term)
  }

  return (
    <motion.div 
      className="relative"
      animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
    >
      {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> */}
      <Input
        type="search"
        placeholder="🔍 Buscar productos..."
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="pl-9 w-full md:w-[300px] bg-background/50 backdrop-blur-sm transition-all border-primary/20 focus:border-primary"
      />
    </motion.div>
  )
}

