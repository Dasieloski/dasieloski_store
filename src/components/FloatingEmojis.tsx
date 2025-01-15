'use client'

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

// Definir emojis fuera del componente para evitar recreación en cada render
const EMOJIS = ["🚀", "⭐", "💫", "✨", "🌟", "💝", "🎉", "🎈", "🎊", "🎁"]

const FloatingEmojis = () => {
    const [positions, setPositions] = useState<{x: number, y: number}[]>([])

    useEffect(() => {
        const updatePositions = () => {
            const newPositions = EMOJIS.map(() => ({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
            }))
            setPositions(newPositions)
        }

        // Establecer posiciones al montar el componente
        updatePositions()

        // Actualizar posiciones al redimensionar la ventana
        window.addEventListener('resize', updatePositions)

        return () => {
            window.removeEventListener('resize', updatePositions)
        }
    }, []) // Lista de dependencias vacía

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {EMOJIS.map((emoji, index) => (
                <motion.div
                    key={index}
                    className="absolute text-3xl"
                    initial={{
                        x: positions[index]?.x || 0,
                        y: positions[index]?.y || 0,
                        opacity: 0
                    }}
                    animate={{
                        y: -500,
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

export default FloatingEmojis