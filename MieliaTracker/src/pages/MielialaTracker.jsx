import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import entryService from '../services/entries'
import trashIcon from '../assets/trash.svg'

//Mieliala arvot
const moodOptions = [
    { value: 1, label: '1', color: '#e53935' },
    { value: 2, label: '2', color: '#fb8c00' },
    { value: 3, label: '3', color: '#d4c02a' },
    { value: 4, label: '4', color: '#9ccc65' },
    { value: 5, label: '5', color: '#43a047', },
];

//Unimäärä arvot
const sleepOptions = [
    { value: '<5', label: '<5', color: '#e53935' },
    { value: '5-6', label: '5-6', color: '#fb8c00' },
    { value: '6-7', label: '6-7', color: '#d4c02a' },
    { value: '7-8', label: '7-8', color: '#9ccc65' },
    { value: '>8', label: '>8', color: '#43a047' },
]

//Mielialanapit lomakkeeseen: näyttää yhden napin per moodOptions-arvo,
//korostaa (pienentää) sen napin joka on valittuna
const MoodButtons = ({ moodOptions, mood, setMood }) => {
    return (
        <MoodBs>
            {moodOptions.map((option) => (
                <MoodButton
                    key={option.value}
                    type="button"
                    style={{
                        backgroundColor: option.color,
                        transform: mood === option.value ? 'scale(0.85)' : 'scale(1)'
                    }}
                    onClick={() => setMood(option.value)}
                >
                    {option.label}
                </MoodButton>
            ))}
        </MoodBs>
    )
}

//Uninapit lomakkeeseen: sama periaate kuin MoodButtons-komponentissa,
//mutta unimäärävaihtoehdoille
const SleepButtons = ({ sleepOptions, sleep, setSleep }) => {
    return (
        <MoodBs>
            {sleepOptions.map((option) => (
                <MoodButton
                    key={option.value}
                    type="button"
                    style={{
                        backgroundColor: option.color,
                        transform: sleep === option.value ? 'scale(0.85)' : 'scale(1)'
                    }}
                    onClick={() => setSleep(option.value)}
                >
                    {option.label}
                </MoodButton>
            ))}
        </MoodBs>
    )
}

//Palauttaa mielialaa vastaavan värin moodOptions-listasta,
//käytetään merkintälistan taustavärinä
const getMoodColor = (moodValue) =>
    moodOptions.find((option) => option.value === moodValue)?.color

//Lista kaikista merkinnöistä: näyttää päivämäärän, mielialan ja unimäärän
//jokaiselle merkinnälle sekä poistonapin
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

function MielialaTracker() {
    //entries: kaikki merkinnät serveriltä
    const [entries, setEntries] = useState([])
    //date, mood, sleep: lomakkeen tämänhetkiset valinnat
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [mood, setMood] = useState(null)
    const [sleep, setSleep] = useState(null)
    //dark mode -tila, oletusarvo luetaan localStoragesta
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')

    //Haetaan kaikki merkinnät serveriltä kun sivu ladataan,
    //ja järjestetään ne päivämäärän mukaan uusimmasta vanhimpaan
    useEffect(() => {
        entryService
            .getAll()
            .then((data) => setEntries(data.sort((a, b) => new Date(b.date) - new Date(a.date))))
    }, [])

    //Vaihtaa teemaa (light/dark) ja tallentaa valinnan local storageen
    //aina kun darkMode-tila muuttuu
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
        localStorage.setItem('darkMode', darkMode)
    }, [darkMode])

    //Lomakkeen tarkistus, lähetys ja tyhjennys.
    //Jos valitulle päivälle on jo olemassa merkintä, kysytään käyttäjältä
    //haluaako hän päivittää sen; muuten luodaan uusi merkintä.
    const handleSubmit = () => {
        //Varmistetaan että kaikki kentät on täytetty ennen lähetystä
        if (!date || mood === null || sleep === null) {
            alert('Valitse päivämäärä, mieliala ja unen määrä ennen lähettämistä.')
            setMood(null)
            setSleep(null)
            return
        }

        const newEntry = { date, mood, sleep }
        //Tarkistetaan löytyykö valitulle päivämäärälle jo merkintä
        const entryExists = entries.find(entry => entry.date === date)

        if (entryExists) {
            //Merkintä löytyi -> kysytään vahvistus ja päivitetään olemassa oleva merkintä.
            if (window.confirm(`${date} on jo merkattu. Haluatko muokata merkkausta?`)) {
                entryService.update(entryExists.id, newEntry).then((updatedEntry) => {
                    setEntries(entries.map((entry) =>
                        entry.id === updatedEntry.id ? updatedEntry : entry
                    ))
                })
            }
            setMood(null)
            setSleep(null)
            //return estää sen, että koodi jatkaisi alla olevaan create-kutsuun
            //ja loisi vahingossa duplikaattimerkinnän
            return
        }

        //Merkintää ei löytynyt -> luodaan uusi merkintä palvelimelle
        entryService.create(newEntry).then((savedEntry) => {
            setEntries((prev) =>
                [...prev, savedEntry].sort((a, b) => new Date(b.date) - new Date(a.date))
            )
            setMood(null)
            setSleep(null)
        })
    }

    //Poistaa merkinnän palvelimelta vahvistuksen jälkeen ja päivittää tilan
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
                <h3>Mieliala tracker</h3>
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
                    <p>Oletuksena merkintä lisätään tämän päivän päivämäärälle</p>
                    {/* Päivämäärän valinta */}
                    <ChooseDate type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                    <h2>Millainen mieliala sinulla on tänään?</h2>
                    <MoodButtons moodOptions={moodOptions} mood={mood} setMood={setMood} />

                    <h2>Kuinka monta tuntia nukuit viime yönä?</h2>
                    <SleepButtons sleepOptions={sleepOptions} sleep={sleep} setSleep={setSleep} />

                    <Submit>
                        <button onClick={handleSubmit}>Lähetä</button>
                    </Submit>

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

const RemoveButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    justify-content: right;

    img {
        width: 30px;
        height: 30px;
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

const MoodBs = styled.div`
    display: flex;
    gap: 20px;
    justify-content: center;
`

const MoodButton = styled.button`
    border: none;
    height: 50px;
    width: 70px;
    border-radius: 5px;
    color: white;
    box-shadow: 3px 2px 5px rgba(0, 0, 0, 0.3);
    cursor: pointer;
`

const Submit = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;

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

const MerkintaRivi = styled.div`
    color: white;
    padding: 15px;
    border-radius: 5px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const MerkintaOikea = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
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

export default MielialaTracker