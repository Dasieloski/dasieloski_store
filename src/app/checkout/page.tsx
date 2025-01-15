'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CartItem {
    id: number
    name: string
    price: number
    emoji: string
    quantity?: number
}

export default function CheckoutPage() {
    const router = useRouter()
    // En un caso real, obtendríamos esto del contexto o estado global
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        // Construir el mensaje para WhatsApp
        let message = "🛍️ *Nuevo Pedido en Dasieloski Store*\n\n"
        message += "👤 *Datos del Cliente:*\n"
        message += `- Nombre: ${formData.get('name')}\n`
        message += `- Teléfono: ${formData.get('phone')}\n`
        message += `- Email: ${formData.get('email')}\n\n`
        message += "📍 *Dirección de Envío:*\n"
        message += `${formData.get('address')}\n\n`
        message += "🛒 *Productos:*\n"

        cart.forEach(item => {
            message += `- ${item.emoji} ${item.name}: $${item.price} x ${item.quantity || 1}\n`
        })

        message += `\n💰 *Total:* $${total.toFixed(2)}`

        // Codificar el mensaje para la URL
        const encodedMessage = encodeURIComponent(message)

        // Número de WhatsApp (reemplazar con el número real)
        const phoneNumber = "1234567890"

        // Abrir WhatsApp
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card aria-describedby="checkout-description">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                🚚 Datos de Envío
                            </CardTitle>
                            <p id="checkout-description" className="text-sm text-muted-foreground">
                                Complete los siguientes datos para procesar su pedido
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nombre completo</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="Juan Pérez"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Teléfono</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="+1234567890"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="juan@ejemplo.com"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Dirección completa</Label>
                                        <Textarea
                                            id="address"
                                            name="address"
                                            placeholder="Calle, número, ciudad, código postal..."
                                            required
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4 space-y-4">
                                    <h3 className="font-semibold">🛒 Resumen del Pedido</h3>
                                    <div className="space-y-2">
                                        {cart.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center text-sm">
                                                <span>
                                                    {item.emoji} {item.name} x{item.quantity || 1}
                                                </span>
                                                <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                                            </div>
                                        ))}
                                        <div className="border-t pt-2 mt-2">
                                            <div className="flex justify-between items-center font-bold">
                                                <span>Total:</span>
                                                <span>${total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <Button type="submit" className="w-full text-lg">
                                        💬 Continuar en WhatsApp
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                        className="w-full"
                                    >
                                        ← Volver al carrito
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}

