import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Lista de posibles gradientes de Tailwind CSS
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
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener las categorías.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, emoji, description } = data

    // Validar los campos necesarios
    if (!name || !emoji || !description) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos.' },
        { status: 400 }
      )
    }

    // Crear la categoría con id igual al nombre (slugificado)
    const slugify = (text: string) => {
      return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    }

    const id = slugify(name)

    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategory = await prisma.category.findUnique({ where: { id } })
    if (existingCategory) {
      return NextResponse.json(
        { error: 'La categoría con este nombre ya existe.' },
        { status: 409 }
      )
    }

    // Asignar un gradiente aleatorio
    const gradient = getRandomGradient()

    // Crear la categoría
    const newCategory = await prisma.category.create({
      data: {
        id,
        name,
        emoji,
        description,
        gradient,
      },
    })

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: 'Error al crear la categoría.' }, { status: 500 })
  }
} 