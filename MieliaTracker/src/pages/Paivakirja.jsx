import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import entryService from '../services/entries'
import trashIcon from '../assets/trash.svg'
import darkIcon from '../assets/dark_mode.svg'
import lightIcon from '../assets/light_mode.svg'

const EntriesList = ({ entries, removeEntry }) => {
    return (
        <Merkinnat>
            <h2>Viimeisimmät merkinnät</h2>
            {entries.length === 0 ? (
                <p>Ei vielä merkintöjä.</p>
            ) : (
                entries.map((entry, index) => (
                    <MerkintaRivi
                        key={index}
                        style={{ backgroundColor: getMoodColor(entry.mood) }}
                    >
                        <span>{entry.date}</span>
                        <MerkintaOikea>
                            <span>Mieliala: {entry.mood}</span>
                            <span>Unen määrä: {entry.sleep} tuntia</span>
                            <RemoveButton onClick={() => removeEntry(entry.id)}>
                                <img src={trashIcon} alt="poista" />
                            </RemoveButton>
                        </MerkintaOikea>
                    </MerkintaRivi>
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

  return (
    <>
      <StyledHeader>
                <Link to="/"><button>Etusivu</button></Link>
                <h3>Päiväkirja</h3>
                {/* Dark mode -kytkin */}
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
              </Valinnat>
              <EntriesList entries={entries} removeEntry={removeEntry} />
            </MoodBoksit>
    </>
  )
}

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

const MerkintaRivi = styled.div`
    color: white;
    padding: 15px;
    border-radius: 5px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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