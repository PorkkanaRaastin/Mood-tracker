import styled from 'styled-components'
import { useState, useEffect } from 'react'
import entryService from '../services/entries'
import {
    MielialaHeader, 
    EntriesList, 
    MoodButtons, 
    SleepButtons} from '../components/MielialaComponents'

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
                <MielialaHeader darkMode={darkMode} setDarkMode={setDarkMode}/>
            </StyledHeader>
            <MoodBoksit>
                <Valinnat>
                    <h2>Mille päivälle haluat lisätä merkinnän?</h2>
                    <p>Oletuksena merkintä lisätään tämän päivän päivämäärälle</p>
                    {/* Päivämäärän valinta */}
                    <ChooseDate type="date" value={date} onChange={(event) => setDate(event.target.value)} />

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

export default MielialaTracker