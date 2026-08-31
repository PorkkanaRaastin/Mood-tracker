import entryService from '../services/paivakirjaService'
import { EntriesList } from '../components/PaivakirjaComponents'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import darkIcon from '../assets/dark_mode.svg'
import lightIcon from '../assets/light_mode.svg'
import goodIcon from '../assets/good.svg'
import neutralIcon from '../assets/neutral.svg'
import badIcon from '../assets/bad.svg'

function Paivakirja() {
    //dark teema
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [entries, setEntries] = useState([])
    const [text, setText] = useState('')
    const [mood, setMood] = useState(null)

    //haetaan kaikki merkinnät palvelimelta
    useEffect(() => {
        entryService.getAll().then(data => setEntries(data))
    }, [])

    //teeman vaihto ja antribuutin päivitys
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
        localStorage.setItem('darkMode', darkMode)
    }, [darkMode])

    //poistaa merkinnän käyttäjän hyväksymisen jälkeen
    const removeEntry = (id) => {
        if (window.confirm('Poistetaanko merkintä?')) {
            entryService.remove(id).then(() => {
                setEntries(entries.filter(entry => entry.id !== id))
            })
        }
    }

    //lähetys logiikka jossa tarkistetaan luodaanko uusi merkintä vai päivitetäänkö vanhaa
    const handleSubmit = () => {
        if (!text.trim() || !mood) {
            alert('Kirjoita mietteet ja valitse mieliala ennen lähettämistä.')
            return
        }

        const existingEntry = entries.find(entry => entry.date === date)
        
        //kysytään halutaanko päivittää merkintä
        if (existingEntry) {
            const confirmUpdate = window.confirm(
                `Tälle päivälle (${date}) on jo merkintä. Haluatko päivittää sen?`
            )

            if (!confirmUpdate) {
                return
            }
            
            //päivitetään merkintä mikäli päivitys hyväksytään
            const updatedEntry = {
                ...existingEntry,
                text: text,
                mood: mood
            }
            
            //lähetetään päivitys palvelimelle
            entryService.update(existingEntry.id, updatedEntry).then(returnedEntry => {
                setEntries(entries.map(entry =>
                    entry.id !== existingEntry.id ? entry : returnedEntry
                ))
                setText('')
                setMood(null)
            })
        } else { //ei aijempaa päivitystä -> lisätään uusi merkintä
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
                            onChange={(event) => setText(event.target.value)}
                        />
                    </PaivakirjaText>
                    <PaivakirjaMoods>
                        <button
                            type="button"
                            className={mood === 'good' ? 'selected' : ''}
                            onClick={() => setMood('good')}
                        >
                            <img src={goodIcon} alt="Hyvä" />
                        </button>
                        <button
                            type="button"
                            className={mood === 'neutral' ? 'selected' : ''}
                            onClick={() => setMood('neutral')}
                        >
                            <img src={neutralIcon} alt="Neutraali" />
                        </button>
                        <button
                            type="button"
                            className={mood === 'bad' ? 'selected' : ''}
                            onClick={() => setMood('bad')}
                        >
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
    border-radius: 50%;
    transition: filter 0.2s, transform 0.2s;
  }

  button.selected {
    filter: drop-shadow(0 0 8px var(--mood-glow-color));
    transform: scale(1.1);
  }

  img {
    width: 40px;
    height: 40px;
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