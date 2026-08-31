import entryService from '../services/paivakirjaService'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import trashIcon from '../assets/trash.svg'
import darkIcon from '../assets/dark_mode.svg'
import lightIcon from '../assets/light_mode.svg'
import goodIcon from '../assets/good.svg';
import neutralIcon from '../assets/neutral.svg';
import badIcon from '../assets/bad.svg';

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
                <span>{entry.date}</span>
                <img
                    src={getMoodIcon(entry.mood)}
                    alt={entry.mood}
                    style={{ width: '24px', height: '24px' }}
                />
                <ToggleButton onClick={() => setOpen(!open)}>
                    {open ? 'Sulje' : 'Näytä lisää'}
                </ToggleButton>
                <RemoveButton onClick={() => removeEntry(entry.id)}>
                    <img src={trashIcon} alt="poista" />
                </RemoveButton>
            </MerkintaYlarivi>

            {open && (
                <EntryTeksti>{entry.text}</EntryTeksti>
            )}
        </MerkintaRivi>
    )
}

const EntriesList = ({ entries, removeEntry }) => {
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

function Paivakirja() {
    //dark teema
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [entries, setEntries] = useState([])
    const [text, setText] = useState('')
    const [mood, setMood] = useState(null)

    useEffect(() => {
    entryService.getAll().then(data => setEntries(data))
    }, [])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
        localStorage.setItem('darkMode', darkMode)
    }, [darkMode])

    const removeEntry = (id) => {
    if (window.confirm('Poistetaanko merkintä?')) {
        entryService.remove(id).then(() => {
            setEntries(entries.filter(entry => entry.id !== id))
        })
    }
}

    const handleSubmit = () => {
    if (!text.trim() || !mood) {
        alert('Kirjoita mietteet ja valitse mieliala ennen lähettämistä.')
        return
    }

    const newEntry = {
        date: date,
        text: text,
        mood: mood
    }

    entryService.create(newEntry).then(savedEntry => {
        setEntries([savedEntry, ...entries])
        setText('')
        setMood(null)
    })
}

    return (
        <>
            <StyledHeader>
                <Link to="/"><button>Etusivu</button></Link>
                <h3>Päiväkirja</h3>
                {/* Dark mode -kytkin */}
                <img
                    src={darkMode ? darkIcon : lightIcon}
                    alt={darkMode ? 'dark mode' : 'light mode'}
                    style={!darkMode ? { filter: 'brightness(0.5)' } : undefined}
                />
                <ThemeSwitch>
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                    />
                    <span className="slider"></span>
                </ThemeSwitch>
            </StyledHeader>
            <MoodBoksit>
                <Valinnat>
                    <h2>Mille päivälle haluat lisätä merkinnän?</h2>
                    <p>Oletuksena merkintä lisätään tälle päivämäärälle</p>
                    <ChooseDate type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                      <h2>Kirjoita päivän mietteet</h2>
                      <PaivakirjaText>
                        <textarea 
                        placeholder="Kirjoita päivän mietteet..."
                        value={text}
                        onChange={(event) => setText(event.target.value)}/>
                      </PaivakirjaText>
                      <PaivakirjaMoods>
                        <button type="button" onClick={() => setMood('good')}>
                          <img src={goodIcon} alt="Hyvä" />
                        </button>
                        <button type="button" onClick={() => setMood('neutral')}>
                          <img src={neutralIcon} alt="Neutraali" />
                        </button>
                        <button type="button" onClick={() => setMood('bad')}>
                          <img src={badIcon} alt="Huono" />
                        </button>
                      </PaivakirjaMoods>
                      <Submit>
                        <button onClick={handleSubmit}>Lähetä</button>
                      </Submit>
                </Valinnat>
                <EntriesList entries={entries} removeEntry={removeEntry} />
            </MoodBoksit>
        </>
    )
}

const PaivakirjaMoods = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;

  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  img {
    width: 40px;
    height: 40px;
  }
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

const MerkintaOikea = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
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

const PaivakirjaText = styled.div`
  display: flex;
  justify-content: center;

  textarea {
    margin-top: 20px;
    height: 50px;
    width: 300px;
    border: 3px solid #bdb9b9;
    border-radius: 6px;
    box-shadow: 2px 2px #8d8a8a
  }
`

const StyledHeader = styled.header`
    background-color: var(--header-bg);
    color: var(--header-text);
    text-align: center;
    height: 70px;
    width: 65%;
    margin: auto;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;

    img {
        margin-left: auto;
        margin-right: 10px;
    }

    h3 {
        margin-left: auto;
    }

    a {
        text-decoration: none;
        color: var(--a);
    }
    a button {
        border: none;
        background-color: rgb(126, 24, 177);
        box-shadow: 3px 2px rgb(189, 141, 213);
        color: white;
        border-radius: 5px;
        padding: 7px;
        cursor: pointer;
    }
`

const Submit = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 15px;

    button {
        border: none;
        background-color: rgb(126, 24, 177);
        box-shadow: 3px 2px rgb(189, 141, 213);
        color: white;
        border-radius: 5px;
        padding: 7px;
        cursor: pointer;
    }
`

const MoodBoksit = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 10px;

    @media (max-width: 1200px) {
        flex-direction: column;
        align-items: center;
    }
`

const Valinnat = styled.div`
    background-color: var(--card-bg);
    color: var(--text);
    padding: 15px;
    border-radius: 10px;
    box-shadow: 5px 5px var(--shadow);

    h2 {
        text-align: center;
    }

    @media (max-width: 1200px) {
        margin-top: 10px;
    }
`


const ThemeSwitch = styled.label`
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;

    input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        border-radius: 24px;
        transition: 0.2s;
    }

    .slider::before {
        content: "";
        position: absolute;
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        border-radius: 50%;
        transition: 0.2s;
    }

    input:checked + .slider {
        background-color: #534AB7;
    }

    input:checked + .slider::before {
        transform: translateX(20px);
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

const ChooseDate = styled.input`
    background: var(--input-bg);
    border: 3px solid var(--input-border);
    box-shadow: 2px 2px var(--input-shadow);
    border-radius: 6px;
    padding: 6px 10px;
    color: var(--text);
    font-size: 13px;
    color-scheme: var(--color-scheme);
    cursor: pointer;
`

export default Paivakirja