import React, { MouseEvent, useEffect, useRef, useState } from 'react'

import artboardSlice from '../store/artboardSlice'

import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { useDispatch } from 'react-redux'
import { doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore'
import { db } from '../server/firebase'

type Props = {
    className?: string | null
}

type Styles = {
    static: string
    dynamic?: string | null
}

const styles = {} as Styles

styles.static = 'w-full h-full cursor-crosshair'

const Canvas = ({ className }: Props) => {
    const urlparams = new URLSearchParams(window.location.search)
    const roomId: any = urlparams.get('id')

    const artboard = {
        state: useSelector((state: RootState) => state.artboard),
        actions: artboardSlice.actions,
    }

    const canvas = useRef<HTMLCanvasElement | null>(null)
    const ctx = canvas.current?.getContext('2d')

    const [dimensions, setDimensions] = useState<{}>({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [line, setLine] = useState<string>('')

    const dispatch = useDispatch()

    useEffect(() => {
        if (!canvas.current) return
        canvas.current.style.width = '100%'
        canvas.current.style.height = '100%'
        canvas.current.width = canvas.current.offsetWidth
        canvas.current.height = canvas.current.offsetHeight
        let image = new Image()
        image.onload = () => {
            ctx?.drawImage(image, 0, 0)
        }
        image.src = line
    }, [dimensions])

    useEffect(() => {
        let image = new Image()
        image.onload = () => {
            ctx?.drawImage(image, 0, 0)
        }
        image.src = line
    }, [line])

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth,
            })
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    })

    useEffect(() => {
        if (!roomId) return
        const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), doc => {
            const result = doc.data()
            setLine(result?.drawings)
        })
    }, [])

    const beginPath = () => {
        if (!ctx) return
        ctx.beginPath()
    }

    const moveTo = (nativeEvent: MouseEvent | any) => {
        if (!ctx) return
        const { offsetX, offsetY } = nativeEvent
        ctx.moveTo(offsetX, offsetY)
    }

    const lineTo = (nativeEvent: MouseEvent | any) => {
        if (!ctx) return
        const { offsetX, offsetY } = nativeEvent
        ctx.lineTo(offsetX, offsetY)
    }

    const styleStroke = () => {
        if (!ctx) return
        ctx.strokeStyle = artboard.state.currentColor
        ctx.lineWidth = artboard.state.lineWidth
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.imageSmoothingQuality = 'high'
    }

    const stroke = () => {
        if (!ctx) return
        ctx.stroke()
    }

    const start = ({ nativeEvent }: MouseEvent | any) => {
        dispatch(artboard.actions.setIsDrawing(true))
        styleStroke()
        moveTo(nativeEvent)
        beginPath()
        lineTo(nativeEvent)
        stroke()
        moveTo(nativeEvent)
        beginPath()
    }

    const stop = async () => {
        if (!ctx) return
        ctx.closePath()
        dispatch(artboard.actions.setIsDrawing(false))
        let base64ImageData = canvas.current?.toDataURL('image/png')
        await updateDoc(doc(db, 'rooms', roomId), {
            drawings: base64ImageData,
        })
    }

    const draw = ({ nativeEvent }: MouseEvent | any) => {
        if (!artboard.state.isDrawing) return
        styleStroke()
        lineTo(nativeEvent)
        stroke()
        beginPath()
        moveTo(nativeEvent)
    }

    return (
        <canvas
            ref={canvas}
            className={`${styles.static} ${styles.dynamic}`}
            onMouseDown={e => {
                start(e)
            }}
            onMouseUp={e => {
                stop()
            }}
            onMouseMove={e => {
                draw(e)
            }}
            onMouseEnter={e => {
                if (!artboard.state.isDrawing) return
                styleStroke()
                moveTo(e)
                beginPath()
                lineTo(e)
                stroke()
            }}
            onMouseLeave={e => {
                moveTo(e)
            }}
            onTouchStart={e => {
                start(e)
            }}
            onTouchEnd={e => {
                stop()
            }}
            onTouchMove={e => {
                draw(e)
            }}
        ></canvas>
    )
}

export default Canvas