import { useState } from 'react'
import styled from 'styled-components'
import trashIcon from '../assets/trash.svg'
import goodIcon from '../assets/good.svg'
import neutralIcon from '../assets/neutral.svg'
import badIcon from '../assets/bad.svg'

const getMoodIcon = (mood) => {
    if (mood === 'good') return goodIcon
    if (mood === 'neutral') return neutralIcon
    if (mood === 'bad') return badIcon
    return null
}

const EntryRow = ({ entry, removeEntry }) => {
    const [open, setOpen] = useState(false)

    return (
        <MerkintaRivi>
            <MerkintaYlarivi>
                <VasenRyhma>
                    <span>{entry.date}</span>
                    <img
                        src={getMoodIcon(entry.mood)}
                        alt={entry.mood}
                        style={{ width: '24px', height: '24px' }}
                    />
                </VasenRyhma>
                <OikeaRyhma>
                    <ToggleButton onClick={() => setOpen(!open)}>
                        {open ? 'Sulje' : 'Näytä lisää'}
                    </ToggleButton>
                    <RemoveButton onClick={() => removeEntry(entry.id)}>
                        <img src={trashIcon} alt="poista" />
                    </RemoveButton>
                </OikeaRyhma>
            </MerkintaYlarivi>

            {open && <EntryTeksti>{entry.text}</EntryTeksti>}
        </MerkintaRivi>
    )
}

export const EntriesList = ({ entries, removeEntry }) => {
    return (
        <Merkinnat>
            <h2>Viimeisimmät merkinnät</h2>
            {entries.length === 0 ? (
                <p>Ei vielä merkintöjä.</p>
            ) : (
                entries.map((entry) => (
                    <EntryRow key={entry.id} entry={entry} removeEntry={removeEntry} />
                ))
            )}
        </Merkinnat>
    )
}

const VasenRyhma = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

const OikeaRyhma = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

const MerkintaRivi = styled.div`
    color: var(--text);
    padding: 15px;
    border-radius: 5px;
    margin-top: 10px;
    border: 1px solid var(--input-border);
`

const MerkintaYlarivi = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
`

const EntryTeksti = styled.p`
    margin-top: 10px;
    margin-bottom: 0;
    padding-left: 5px;
    overflow-wrap: break-word;
    word-break: break-word;
`

const ToggleButton = styled.button`
    background: none;
    border: 1px solid var(--input-border);
    border-radius: 5px;
    padding: 4px 10px;
    cursor: pointer;
    color: var(--text);
    font-size: 12px;
`

const RemoveButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;

    img {
        width: 20px;
        height: 20px;
    }
`

const Merkinnat = styled.div`
    background-color: var(--card-bg);
    color: var(--text);
    padding: 15px;
    border-radius: 10px;
    width: 40rem;
    overflow-y: scroll;
    height: 420px;
    box-shadow: 5px 5px var(--shadow);
    min-height: 450px;

    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: var(--input-border) transparent;

    @media (max-width: 1200px) {
        width: 90%;
        max-width: 30rem;
        margin-top: 10px;
    }
`