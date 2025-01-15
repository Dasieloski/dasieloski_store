import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const category = await prisma.category.findUnique({
            where: { id },
        })

        if (!category) {
            return NextResponse.json({ error: 'Categoría no encontrada.' }, { status: 404 })
        }

        return NextResponse.json(category)
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message)
        }
        return NextResponse.json({ error: 'Error al obtener el producto.' }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const data = await request.json()
        const { name, emoji, description } = data

        // Validar que el nuevo nombre no exista ya en otra categoría
        const existingCategory = await prisma.category.findUnique({
            where: { name },
        })

        if (existingCategory && existingCategory.id !== id) {
            return NextResponse.json(
                { error: 'Ya existe una categoría con este nombre.' },
                { status: 409 }
            )
        }

        // Actualizar los campos permitidos
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                name,
                emoji,
                description,
            },
        })

        return NextResponse.json(updatedCategory)
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: 'Categoría no encontrada.' },
                { status: 404 }
            )
        }
        return NextResponse.json({ error: 'Error al actualizar la categoría.' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params

        const deletedCategory = await prisma.category.delete({
            where: { id },
        })

        return NextResponse.json(deletedCategory)
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: 'Categoría no encontrada.' },
                { status: 404 }
            )
        }
        return NextResponse.json({ error: 'Error al eliminar la categoría.' }, { status: 500 })
    }
}