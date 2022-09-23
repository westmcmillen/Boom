import { FC, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Dispatch, SetStateAction } from 'react'
import { RootState } from '../../store/index'
import gameSlice from '../../store/gameSlice'
import PlayerButton from './PlayerButton'
import IParticipant from '../interfaces/IParticipant'

interface IParticipantWithIndex extends IParticipant {
    index: number
}

type Props = {
    setPrompt: Dispatch<SetStateAction<string>>
    setWasClicked: Dispatch<SetStateAction<boolean>>
}

const GivePointModal: FC<Props> = ({ setPrompt, setWasClicked }) => {
    const game = {
        state: useSelector((state: RootState) => state.game),
        action: gameSlice.actions,
    }

    const participants = useMemo(() => {
        const participants: IParticipantWithIndex[] = []
        game.state.players.forEach((player, index) => {
            if (index !== game.state.whosTurn)
                participants.push({
                    ...player,
                    index,
                })
        })
        return participants
    }, [game.state.players, game.state.whosTurn])

    return (
        <div>
            {participants.map(({ index, player }: IParticipantWithIndex) => {
                return (
                    <PlayerButton
                        index={index}
                        name={player}
                        setPrompt={setPrompt}
                        setWasClicked={setWasClicked}
                    />
                )
            })}
        </div>
    )
}

export default GivePointModal