'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id: string
  name: string
  price: number
  image: string
  categoryId: string
  category: {
    id: string
    name: string
    emoji: string
  }
  description: string
  emoji: string
  detailedDescription: string
  specifications: string[]
  stock: number
  reactions: string[]
  images: {
    id: string
    url: string
    alt: string
  }[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<{ id: string, name: string, emoji: string }[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    categoryId: '',
    description: '',
    emoji: '',
    detailedDescription: '',
    specifications: '',
    stock: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (!res.ok) {
        throw new Error('Error al obtener los productos.')
      }
      const data: Product[] = await res.json()
      setProducts(data)
    } catch (err) {
      setError('Error al cargar los productos.')
      console.error(err)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (!res.ok) {
        throw new Error('Error al obtener las categorías.')
      }
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      setError('Error al cargar las categorías.')
      console.error(err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      if (editingProduct) {
        // Actualizar producto
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            price: parseFloat(formData.price),
            image: formData.image,
            categoryId: formData.categoryId,
            description: formData.description,
            emoji: formData.emoji,
            detailedDescription: formData.detailedDescription,
            specifications: formData.specifications.split(',').map(spec => spec.trim()),
            stock: parseInt(formData.stock, 10),
          }),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Error al actualizar el producto.')
        }

        const updatedProduct: Product = await res.json()
        setProducts(products.map(prod => prod.id === updatedProduct.id ? updatedProduct : prod))
      } else {
        // Crear nuevo producto
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            price: parseFloat(formData.price),
            image: formData.image,
            categoryId: formData.categoryId,
            description: formData.description,
            emoji: formData.emoji,
            detailedDescription: formData.detailedDescription,
            specifications: formData.specifications.split(',').map(spec => spec.trim()),
            stock: parseInt(formData.stock, 10),
          }),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Error al crear el producto.')
        }

        const newProduct: Product = await res.json()
        setProducts([...products, newProduct])
      }

      setIsOpen(false)
      setFormData({
        name: '',
        price: '',
        image: '',
        categoryId: '',
        description: '',
        emoji: '',
        detailedDescription: '',
        specifications: '',
        stock: ''
      })
      setEditingProduct(null)
    } catch  {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      categoryId: product.categoryId,
      description: product.description,
      emoji: product.emoji,
      detailedDescription: product.detailedDescription,
      specifications: product.specifications.join(', '),
      stock: product.stock.toString()
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al eliminar el producto.')
      }

      setProducts(products.filter(prod => prod.id !== id))
    } catch  {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📦 Gestión de Productos</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>✨ Nuevo Producto</Button>
          </DialogTrigger>
          <DialogContent aria-describedby="product-form-description" className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? '✏️ Editar Producto' : '✨ Nuevo Producto'}
              </DialogTitle>
              <DialogDescription id="product-form-description">
                Añade o modifica los detalles del producto aquí. Asegúrate de completar todos los campos requeridos.
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
                  placeholder="Nombre del producto"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Precio en USD"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">URL de la Imagen</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoría</Label>
                <Select
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  defaultValue={formData.categoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descripción breve del producto..."
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
                <Label htmlFor="detailedDescription">Descripción Detallada</Label>
                <Textarea
                  id="detailedDescription"
                  name="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={handleChange}
                  placeholder="Descripción completa del producto..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specifications">Especificaciones (separadas por comas)</Label>
                <Input
                  id="specifications"
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleChange}
                  placeholder="Especificación 1, Especificación 2, ..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Cantidad disponible"
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? (editingProduct ? 'Guardando...' : 'Creando...') : (editingProduct ? '💾 Guardar Cambios' : '✨ Crear Producto')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/0 flex items-end p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{product.emoji}</span>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                            {product.category.name}
                          </span>
                          <span className="font-bold">
                            💰 ${product.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-2 pt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
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

