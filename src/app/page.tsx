'use client'

import * as React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useRouter } from 'next/navigation'
import { SearchProducts } from "@/components/search-products"
import { Sun, Moon, ShoppingCart, Heart } from 'lucide-react'
//import { Product } from "@prisma/client"

// Floating emojis animation
const FloatingEmojis = () => {
    const emojis = ["🚀", "⭐", "💫", "✨", "🌟", "💝", "🎉", "🎈", "🎊", "🎁"]

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {emojis.map((emoji, index) => (
                <motion.div
                    key={index}
                    className="absolute text-3xl"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        opacity: 0
                    }}
                    animate={{
                        y: [null, -500],
                        opacity: [0, 1, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 10 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 20
                    }}
                >
                    {emoji}
                </motion.div>
            ))}
        </div>
    )
}

/* // Mock data
const products = [
    {
        id: 1,
        name: "Super Gaming Laptop 🎮",
        price: 999.99,
        images: [
            { url: "/placeholder.svg?height=400&width=400", alt: "Gaming Laptop" }
        ],
        category: "Tecnología",
        description: "¡El mejor laptop para gaming! 🚀",
        reactions: ["🔥", "💻", "🎮", "⚡"],
        stock: 5
    },
    {
        id: 2,
        name: "Zapatillas Runner Pro 👟",
        price: 89.99,
        images: [
            { url: "/placeholder.svg?height=400&width=400", alt: "Zapatillas" }
        ],
        category: "Deportes",
        description: "¡Corre como nunca! 🏃‍♂️",
        reactions: ["👟", "🏃‍♂️", "💨", "🌟"],
        stock: 10
    },
    {
        id: 3,
        name: "Smartphone Ultra Plus 📱",
        price: 699.99,
        images: [
            { url: "/placeholder.svg?height=400&width=400", alt: "Smartphone" }
        ],
        category: "Tecnología",
        description: "¡La mejor cámara del mercado! 📸",
        reactions: ["📱", "📸", "🎵", "✨"],
        stock: 8
    }
] */

interface Category {
    id: string
    name: string
    emoji: string
    gradient: string
}

const todosCategory: Category = { id: "todos", name: "Todos", emoji: "🌟", gradient: "from-pink-500 to-purple-500" }

interface Product {
    id: string
    name: string
    price: number
    images: {
        url: string
        alt: string
    }[]
    category: {
        id: string
        name: string
        emoji: string
    }
    description: string
    reactions: string[]
    stock: number
}

export default function Store() {
    const router = useRouter()
    const [darkMode, setDarkMode] = React.useState(true)
    const [cart, setCart] = React.useState<Product[]>([])
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)
    const [hoveredProduct, setHoveredProduct] = React.useState<string | null>(null)
    const [categories, setCategories] = React.useState<Category[]>([])
    const [products, setProducts] = React.useState<Product[]>([])
    const [error, setError] = React.useState<string | null>(null)

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        document.documentElement.classList.toggle('dark')
    }

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "todos" ||
            product.category.name.toLowerCase() === selectedCategory
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Cart functions
    const addToCart = (product: Product) => {
        if (product.images && product.images.length > 0) {
            setCart([...cart, product]);
        } else {
            alert('Este producto no tiene imágenes disponibles.');
        }
    };

const removeFromCart = (productId: string) => {
    const index = cart.findIndex(item => item.id === productId)
    if (index > -1) {
        const newCart = [...cart]
        newCart.splice(index, 1)
        setCart(newCart)
    }
}

    const total = cart.reduce((sum, item) => sum + item.price, 0)

    React.useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode)
    }, [])

    React.useEffect(() => {
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
        } catch (error) {
            setError('Error al cargar los productos.')
            console.error(error)
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories')
            if (!res.ok) {
                throw new Error('Error al obtener las categorías.')
            }
            const data: Category[] = await res.json()
            setCategories([todosCategory, ...data])
        } catch (err) {
            setError('Error al cargar las categorías.')
            console.error(err)
            setCategories([todosCategory])
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <FloatingEmojis />

            {/* Navigation */}
            <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl font-bold"
                        >
                            ✨ Dasieloski Store
                        </motion.h1>
                        <div className="flex items-center gap-4">
                            <SearchProducts onSearch={setSearchTerm} />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleDarkMode}
                                className="text-xl"
                            >
                                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            </Button>
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="relative">
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        Carrito
                                        {cart.length > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center"
                                            >
                                                {cart.length}
                                            </motion.span>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>🛍️ Tu Carrito</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-8 space-y-4">
                                        {cart.length === 0 ? (
                                            <div className="text-center space-y-2">
                                                <p className="text-2xl">🛒</p>
                                                <p className="text-muted-foreground">Tu carrito está vacío</p>
                                            </div>
                                        ) : (
                                            <>
                                                <AnimatePresence>
                                                    {cart.map((item, index) => (
                                                        <motion.div
                                                            key={`${item.id}-${index}`}
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="flex justify-between items-center bg-muted/50 p-3 rounded-lg"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {item.images && item.images.length > 0 ? (
                                                                    <Image
                                                                        src={item.images[0].url}
                                                                        alt={item.images[0].alt}
                                                                        width={40}
                                                                        height={40}
                                                                        className="rounded-md"
                                                                    />
                                                                ) : (
                                                                    <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-md">
                                                                        <span>No Image</span>
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p className="font-medium">{item.name}</p>
                                                                    <p className="text-sm text-muted-foreground">${item.price}</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeFromCart(item.id)}
                                                            >
                                                                ❌
                                                            </Button>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                                <div className="pt-4 border-t">
                                                    <div className="flex justify-between items-center font-bold mb-4">
                                                        <span>Total:</span>
                                                        <span>${total.toFixed(2)}</span>
                                                    </div>
                                                    <Button
                                                        className="w-full"
                                                        onClick={() => {
                                                            localStorage.setItem('cart', JSON.stringify(cart))
                                                            setIsOpen(false)
                                                            router.push('/checkout')
                                                        }}
                                                    >
                                                        💳 Proceder al pago
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 text-center relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="container mx-auto px-4 space-y-6"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                        ¡Bienvenido a la tienda más
                        <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                            {' '}divertida{' '}
                        </span>
                        de La Habana! 🎉
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Donde cada producto viene con una sonrisa 😊 y los emojis son nuestro lenguaje favorito ✨
                    </p>
                </motion.div>
            </section>

            {/* Categories */}
          <section className="py-12">
    <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
                <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`relative overflow-hidden rounded-xl p-4 h-32 ${
                        selectedCategory === category.id
                            ? 'ring-2 ring-primary'
                            : 'hover:ring-2 hover:ring-primary/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10`} />
                    <div className="relative h-full flex flex-col items-center justify-center gap-2">
                        <span className="text-4xl">{category.emoji}</span>
                        <span className="font-medium">{category.name}</span>
                    </div>
                </motion.button>
            ))}
        </div>
    </div>
</section>

            {/* Products Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card
                                        className="group relative overflow-hidden border-2 transition-colors hover:border-primary/50"
                                        onMouseEnter={() => setHoveredProduct(product.id)}
                                        onMouseLeave={() => setHoveredProduct(null)}
                                    >
                                        <CardContent className="p-0">
                                            <div className="relative aspect-square">
                                                {product.images && product.images.length > 0 ? (
                                                    <Image
                                                        src={product.images[0].url}
                                                        alt={product.images[0].alt}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full bg-gray-200">
                                                        <span>No Image Available</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />

                                                {/* Reaction emojis */}
                                                {hoveredProduct === product.id && (
                                                    <div className="absolute top-4 left-4 right-4">
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="flex gap-2"
                                                        >
                                                            {product.reactions.map((emoji, index) => (
                                                                <motion.button
                                                                    key={index}
                                                                    className="hover:scale-125 transition-transform"
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ delay: index * 0.1 }}
                                                                >
                                                                    <span className="text-2xl">{emoji}</span>
                                                                </motion.button>
                                                            ))}
                                                        </motion.div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                                                <p className="text-muted-foreground">{product.description}</p>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between items-center p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">💰</span>
                                                <span className="font-bold text-lg">${product.price}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="rounded-full"
                                                >
                                                    <Heart className="h-5 w-5" />
                                                </Button>
                                                <Button
                                                    onClick={() => addToCart(product)}
                                                    disabled={product.stock === 0}
                                                    className="rounded-full"
                                                >
                                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                                    Agregar
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-16 border-t">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">📍 Ubicación</h3>
                            <p className="text-muted-foreground">
                                Dasieloski Store<br />
                                La Habana, Cuba 🇨🇺<br />
                                Entregas en toda La Habana 🚚
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">🔗 Enlaces</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="link">🏠 Inicio</Button>
                                <Button variant="link">📦 Productos</Button>
                                <Button variant="link">📞 Contacto</Button>
                                <Button variant="link">❓ Ayuda</Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">📱 Síguenos</h3>
                            <div className="flex gap-4 text-2xl">
                                <Button variant="ghost" size="icon">📸</Button>
                                <Button variant="ghost" size="icon">👥</Button>
                                <Button variant="ghost" size="icon">🐦</Button>
                                <Button variant="ghost" size="icon">📱</Button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t text-center">
                        <p className="text-muted-foreground">
                            © 2024 Dasieloski Store ✨ Todos los derechos reservados 🎉
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

