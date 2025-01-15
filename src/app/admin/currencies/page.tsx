'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Currency {
  id: string
  code: string
  symbol: string
  exchangeRate: number
  isDefault: boolean
}

export default function CurrenciesPage() {
  const [currencies, setCurrencies] = useState<Currency[]>([
    {
      id: '1',
      code: 'CUP',
      symbol: '$',
      exchangeRate: 1,
      isDefault: true
    },
    {
      id: '2',
      code: 'USD',
      symbol: '$',
      exchangeRate: 120,
      isDefault: false
    },
    // ... más monedas
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newCurrency = {
      id: editingCurrency?.id || Date.now().toString(),
      code: formData.get('code') as string,
      symbol: formData.get('symbol') as string,
      exchangeRate: parseFloat(formData.get('exchangeRate') as string),
      isDefault: false
    }

    if (editingCurrency) {
      setCurrencies(currencies.map(curr => 
        curr.id === editingCurrency.id ? newCurrency : curr
      ))
    } else {
      setCurrencies([...currencies, newCurrency])
    }

    setIsOpen(false)
    setEditingCurrency(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">💰 Gestión de Monedas</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>✨ Nueva Moneda</Button>
          </DialogTrigger>
          <DialogContent aria-describedby="currency-form-description">
            <DialogHeader>
              <DialogTitle>
                {editingCurrency ? '✏️ Editar Moneda' : '✨ Nueva Moneda'}
              </DialogTitle>
              <DialogDescription id="currency-form-description">
                Configura los detalles de la moneda y su tipo de cambio.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={editingCurrency?.code}
                  placeholder="USD"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symbol">Símbolo</Label>
                <Input
                  id="symbol"
                  name="symbol"
                  defaultValue={editingCurrency?.symbol}
                  placeholder="$"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exchangeRate">Tipo de Cambio (respecto a CUP)</Label>
                <Input
                  id="exchangeRate"
                  name="exchangeRate"
                  type="number"
                  step="0.01"
                  defaultValue={editingCurrency?.exchangeRate}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingCurrency ? '💾 Guardar Cambios' : '✨ Crear Moneda'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currencies.map((currency) => (
          <Card key={currency.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{currency.symbol} {currency.code}</span>
                {currency.isDefault && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    Por defecto
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Tipo de cambio: {currency.exchangeRate} CUP
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditingCurrency(currency)
                    setIsOpen(true)
                  }}
                >
                  ✏️ Editar
                </Button>
                {!currency.isDefault && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setCurrencies(currencies.filter(c => c.id !== currency.id))
                    }}
                  >
                    🗑️ Eliminar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

