import './App.css'
import { useState, useEffect } from 'react'
import entryService from './services/entries'

//Mieliala napit ja arvot
const moodOptions = [
    { value: 1, label: '1', color: '#e53935' },
    { value: 2, label: '2', color: '#fb8c00' },
    { value: 3, label: '3', color: '#d4c02a' },
    { value: 4, label: '4', color: '#9ccc65' },
    { value: 5, label: '5', color: '#43a047', },
];

//Unimäärä napit ja arvot
const sleepOptions = [
    { value: '<5', label: '<5', color: '#e53935' },
    { value: '5-6', label: '5-6', color: '#fb8c00' },
    { value: '6-7', label: '6-7', color: '#d4c02a' },
    { value: '7-8', label: '7-8', color: '#9ccc65' },
    { value: '>8', label: '>8', color: '#43a047' },
]

//Mielialanapit lomakkeeseen
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

//uninapit lomakkeeseen
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

//mielialan väri arvon perusteella
const getMoodColor = (moodValue) =>
    moodOptions.find((option) => option.value === moodValue)?.color

//lista kaikista merkinnöistä
const EntriesList = ({ entries }) => {
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
                        <span className="merkintaTieto"> Mieliala: {entry.mood}</span>
                        <span className="merkintaTieto"> Unen määrä: {entry.sleep} tuntia</span>
                    </div>
                ))
            )}
        </div>
    )
}

function App() {
    //entries eli kaikki merkinnät serveriltä sekä mitä käyttäjä valitsee lomakkeessa
    const [entries, setEntries] = useState([])
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [mood, setMood] = useState(null)
    const [sleep, setSleep] = useState(null)
    //dark mode tila oletusarvo luetaan localStoragesta
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')

    //haetaan kaikki merkinnät serveriltä kun sivu ladataan
    useEffect(() => {
        entryService
            .getAll()
            .then((data) => setEntries(data.sort((a, b) => new Date(b.date) - new Date(a.date))))
    }, [])

    //vaihtaa teemaa ja tallentaa valinnan local storageen aina kun theme vaihtuu
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
        localStorage.setItem('darkMode', darkMode) 
    }, [darkMode])

    //lomakkeen tarkistus sekä lähetys ja lomakkeen tyhjennys
    const handleSubmit = () => {
        if (!date || mood === null || sleep === null) {
            alert('Valitse päivämäärä, mieliala ja unen määrä ennen lähettämistä.')
            setMood(null)
            setSleep(null)
            return
        }

        const newEntry = { date, mood, sleep }

        entryService.create(newEntry).then((savedEntry) => {
            setEntries((prev) =>
                [...prev, savedEntry].sort((a, b) => new Date(b.date) - new Date(a.date))
            )
            setMood(null)
            setSleep(null)
        })
    }

    return (
        <>
            <header>
                <h3>Mieliala tracker</h3>
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
                    <EntriesList entries={entries} />
            </div>
        </>
    )
}

export default App