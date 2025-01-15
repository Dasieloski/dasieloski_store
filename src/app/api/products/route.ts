import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/* // Lista de posibles gradientes de Tailwind CSS
const availableGradients = [
  "from-pink-500 to-purple-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-red-500",
  "from-violet-500 to-purple-500",
  "from-yellow-500 to-orange-500",
  "from-indigo-500 to-blue-500",
  "from-red-500 to-pink-500",
  "from-gray-500 to-gray-700",
  "from-teal-500 to-green-500"
]

// Función para seleccionar un gradiente aleatorio
const getRandomGradient = (): string => {
  const index = Math.floor(Math.random() * availableGradients.length)
  return availableGradients[index]
} */

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
      },
    })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: 'Error al obtener los productos.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, price, image, categoryId, description, emoji, detailedDescription, specifications, stock } = data

    // Validar los campos necesarios
    if (!name || !price || !categoryId || !description || !emoji) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos.' },
        { status: 400 }
      )
    }

    // Crear el producto
    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        image,
        categoryId,
        description,
        emoji,
        detailedDescription: detailedDescription || description,
        specifications: specifications || [],
        stock: stock || 0,
        reactions: [],
      },
      include: {
        category: true,
        images: true,
      },
    })

    return NextResponse.json(newProduct, { status: 201 })
  } catch  {
    console.error(error)
    return NextResponse.json({ error: 'Error al crear el producto.' }, { status: 500 })
  }
} 