import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Error al obtener el producto.' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await request.json()
    const { name, price, image, categoryId, description, emoji, detailedDescription, specifications, stock } = data

    // Validar que el producto exista
    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct) {
      return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 })
    }

    // Actualizar el producto
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name || existingProduct.name,
        price: price || existingProduct.price,
        image: image || existingProduct.image,
        categoryId: categoryId || existingProduct.categoryId,
        description: description || existingProduct.description,
        emoji: emoji || existingProduct.emoji,
        detailedDescription: detailedDescription || existingProduct.detailedDescription,
        specifications: specifications || existingProduct.specifications,
        stock: stock !== undefined ? stock : existingProduct.stock,
      },
      include: {
        category: true,
        images: true,
      },
    })

    return NextResponse.json(updatedProduct)
  } catch  {
    console.error(error)
    return NextResponse.json({ error: 'Error al actualizar el producto.' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Verificar que el producto exista
    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct) {
      return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 })
    }

    // Eliminar el producto
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Producto eliminado correctamente.' }, { status: 200 })
  } catch  {
    console.error(error)
    return NextResponse.json({ error: 'Error al eliminar el producto.' }, { status: 500 })
  }
}