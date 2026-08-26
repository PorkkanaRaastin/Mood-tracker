import './App.css'
import { useState, useEffect } from 'react'
import entryService from './services/entries'
import trashIcon from './assets/trash.svg'

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
        <div className="moodBs">
            {moodOptions.map((option) => (
                <button
                    className="moodButton"
                    key={option.value}
                    type="button"
                    style={{
                        backgroundColor: option.color,
                        transform: mood === option.value ? 'scale(0.85)' : 'scale(1)'
                    }}
                    onClick={() => setMood(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}

//Uninapit lomakkeeseen: sama periaate kuin MoodButtons-komponentissa,
//mutta unimäärävaihtoehdoille
const SleepButtons = ({ sleepOptions, sleep, setSleep }) => {
    return (
        <div className="moodBs">
            {sleepOptions.map((option) => (
                <button
                    className="moodButton"
                    key={option.value}
                    type="button"
                    style={{
                        backgroundColor: option.color,
                        transform: sleep === option.value ? 'scale(0.85)' : 'scale(1)'
                    }}
                    onClick={() => setSleep(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
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
        <div className="merkinnat">
            <h2>Viimeisimmät merkinnät</h2>
            {entries.length === 0 ? (
                <p>Ei vielä merkintöjä.</p>
            ) : (
                entries.map((entry, index) => (
                    <div
                        key={index}
                        className="merkintaRivi"
                        style={{ backgroundColor: getMoodColor(entry.mood) }}
                    >
                        <span className="merkintaPvm">{entry.date}</span>
                        <div className="merkintaOikea">
                            <span className="merkintaTieto">Mieliala: {entry.mood}</span>
                            <span className="merkintaTieto">Unen määrä: {entry.sleep} tuntia</span>
                            <button className="removeButton" onClick={() => removeEntry(entry.id)}>
                                <img src={trashIcon} alt="poista" />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

function App() {
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
            <header>
                <h3>Mieliala tracker</h3>
                {/* Dark mode -kytkin */}
                <label className="themeSwitch">
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                    />
                    <span className="slider"></span>
                </label>
            </header>
            <div className="moodBoksit">
                <div className="valinnat">
                    <h2>Mille päivälle haluat lisätä merkinnän?</h2>
                    <p>Oletuksena merkintä lisätään tämän päivän päivämäärälle</p>
                    {/* Päivämäärän valinta */}
                    <input className="chooseDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                    <h2>Millainen mieliala sinulla on tänään?</h2>
                    <MoodButtons moodOptions={moodOptions} mood={mood} setMood={setMood} />

                    <h2>Kuinka monta tuntia nukuit viime yönä?</h2>
                    <SleepButtons sleepOptions={sleepOptions} sleep={sleep} setSleep={setSleep} />

                    <div className='submit'>
                        <button onClick={handleSubmit}>Lähetä</button>
                    </div>

                </div>
                <EntriesList entries={entries} removeEntry={removeEntry} />
            </div>
        </>
    )
}

export default App