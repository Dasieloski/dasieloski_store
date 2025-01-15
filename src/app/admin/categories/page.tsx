'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface Category {
    id: string
    name: string
    emoji: string
    description: string
    gradient: string
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        emoji: '',
        description: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Cargar las categorías al montar el componente
    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories')
            if (!res.ok) {
                throw new Error('Error al obtener las categorías.')
            }
            const data: Category[] = await res.json()
            setCategories(data)
        } catch (err) {
            setError('Error al cargar las categorías.')
            console.error(err)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (editingCategory) {
                // Actualizar categoría (nombre, emoji y descripción)
                const res = await fetch(`/api/categories/${editingCategory.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        emoji: formData.emoji,
                        description: formData.description,
                    }),
                })

                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.error || 'Error al actualizar la categoría.')
                }

                const updatedCategory: Category = await res.json()
                setCategories(categories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat))
            } else {
                // Crear nueva categoría
                const res = await fetch('/api/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })

                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.error || 'Error al crear la categoría.')
                }

                const newCategory: Category = await res.json()
                setCategories([...categories, newCategory])
            }
        } catch {
            setError(err.message)
        } finally {
            setLoading(false)
            setIsOpen(false)
        }
    }

const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
        name: category.name,       // Asegúrate de incluir el nombre aquí
        emoji: category.emoji,
        description: category.description,
    })
    setIsOpen(true)
}

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Error al eliminar la categoría.')
            }

            setCategories(categories.filter(cat => cat.id !== id))
        } catch {
            alert(err.message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">📁 Gestión de Categorías</h1>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>✨ Nueva Categoría</Button>
                    </DialogTrigger>
                    <DialogContent aria-describedby="category-form-description">
                        <DialogHeader>
                            <DialogTitle>
                                {editingCategory ? '✏️ Editar Categoría' : '✨ Nueva Categoría'}
                            </DialogTitle>
                            <DialogDescription id="category-form-description">
                                Añade o modifica los detalles de la categoría aquí. Todos los campos son requeridos.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Tecnología"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emoji">Emoji</Label>
                                <Input
                                    id="emoji"
                                    name="emoji"
                                    value={formData.emoji}
                                    onChange={handleChange}
                                    placeholder="🚀"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Descripción de la categoría..."
                                    required
                                />
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                            )}
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? (editingCategory ? 'Guardando...' : 'Creando...') : (editingCategory ? '💾 Guardar Cambios' : '✨ Crear Categoría')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {categories.map((category) => (
                        <motion.div
                            key={category.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="overflow-hidden">
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center gap-4">
                                        <span className="text-6xl">{category.emoji}</span>
                                        <div className="text-center">
                                            <h3 className="text-xl font-semibold">{category.name}</h3>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {category.description}
                                            </p>
                                            <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                                                ID: {category.id}
                                            </code>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-center gap-2 pt-6">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleEdit(category)}
                                    >
                                        ✏️ Editar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(category.id)}
                                    >
                                        🗑️ Eliminar
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}

