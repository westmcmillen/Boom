import React, { ReactElement } from 'react'
import Component from './Component'
import Container from '../layout/Container'
import {
    faRightToBracket,
    faMessage,
    faPenToSquare,
    faTableCellsLarge,
    faVideo,
    faCog,
    faBars,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { auth } from '../server/firebase'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import gameSlice from '../store/gameSlice'
import { useDispatch } from 'react-redux'

type Props = {
    menuButtonRef: any
    galleryButtonRef: any
    artboardButtonRef: any
    chatButtonRef: any
    exitButtonRef: any
    className?: string | null
}

type Styles = {
    static: string
    dynamic?: string | null
}

const styles = {} as Styles

styles.static = 'p-2 md:p-3 lg:p-4  bg-neutral-300'

export default function Navbar({
    menuButtonRef,
    galleryButtonRef,
    artboardButtonRef,
    chatButtonRef,
    exitButtonRef,
    className = null,
}: Props) {
    styles.dynamic = className

    const game = {
        state: useSelector((state: RootState) => state.game),
        actions: gameSlice.actions,
    }

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const startGame = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        dispatch(game.actions.setIsInit(true))
    }

    const userEndGame = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        dispatch(game.actions.setIsInit(false))
    }

    const handleSignout = (e: React.SyntheticEvent) => {
        e.preventDefault()
        auth.signOut()
        navigate('/')
    }
    return (
        <Component id='Navbar'>
            <div className={`${styles.static} ${styles.dynamic}`}>
                <Container>
                    <div className='flex justify-between items-center gap-2 h-full'>
                        <button
                            ref={menuButtonRef}
                            className={
                                game.state.isOwner && !game.state.isInit
                                    ? 'py-2 px-4 bg-emerald-500 rounded-md md:w-40 sm:w-40'
                                    : 'hidden'
                            }
                            onClick={startGame}
                        >
                            <span>Start Game</span>
                        </button>
                        <button
                            ref={menuButtonRef}
                            className={
                                game.state.isOwner && game.state.isInit
                                    ? 'py-2 px-4 bg-red-700 rounded-md md:w-40 sm:w-40'
                                    : 'hidden'
                            }
                            onClick={userEndGame}
                        >
                            <span className='text-neutral-100'>End Game</span>
                        </button>
                        <div className='flex justify-center items-center gap-2 h-full'>
                            <button
                                ref={galleryButtonRef}
                                className='py-2 px-4'
                            >
                                <FontAwesomeIcon
                                    icon={faVideo}
                                    className='text-violet-500'
                                />
                            </button>
                            <button
                                ref={artboardButtonRef}
                                className='py-2 px-4'
                            >
                                <FontAwesomeIcon
                                    icon={faTableCellsLarge}
                                    className=''
                                />
                            </button>
                            <button ref={chatButtonRef} className='py-2 px-4'>
                                <FontAwesomeIcon
                                    icon={faMessage}
                                    className=''
                                />
                            </button>
                        </div>
                        <button
                            ref={exitButtonRef}
                            className='py-2 px-4'
                            onClick={handleSignout}
                        >
                            <FontAwesomeIcon
                                icon={faRightToBracket}
                                className=''
                            />
                        </button>
                    </div>
                </Container>
            </div>
        </Component>
    )
}
