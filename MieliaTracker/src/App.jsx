import './App.css'
import { useState } from 'react'

const moodOptions = [
    { value: 1, label: '1', color: '#e53935' },
    { value: 2, label: '2', color: '#fb8c00' },
    { value: 3, label: '3', color: '#d4c02a' },
    { value: 4, label: '4', color: '#9ccc65' },
    { value: 5, label: '5', color: '#43a047', },
];

const sleepOptions = [
    { value: '<5', label: '<5', color: '#e53935' },
    { value: '5-6', label: '5-6', color: '#fb8c00' },
    { value: '6-7', label: '6-7', color: '#d4c02a' },
    { value: '7-8', label: '7-8', color: '#9ccc65' },
    { value: '>8', label: '>8', color: '#43a047' },
]

function App() {

    const [entries, setEntries] = useState([])
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [mood, setMood] = useState(null)
    const [sleep, setSleep] = useState(null)

    const handleSubmit = () => {
        if (!date || mood === null && sleep === null) {
            alert('Valitse päivämäärä, mieliala ja unen määrä ennen lähettämistä.')
            return
        }

        const newEntry = { date, mood, sleep }

        setEntries((prev) =>
            [...prev, newEntry].sort((a, b) => new Date(b.date) - new Date(a.date))
        )

        setMood(null)
        setSleep(null)
    }

    const getMoodColor = (moodValue) =>
        moodOptions.find((option) => option.value === moodValue)?.color

    return (
        <>
            <header>
                <h3>Mieliala tracker</h3>
            </header>
            <div className="moodBoksit">
                <div className="valinnat">
                    <h2>Mille päivälle haluat lisätä merkinnän?</h2>
                    <p>Oletuksena merkintä lisätään tämän päivän päivämäärälle</p>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                    <h2>Millainen mieliala sinulla on tänään?</h2>
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

                    <h2>Kuinka monta tuntia nukuit viime yönä?</h2>
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
                    <div className='submit'>
                        <button onClick={handleSubmit}>Lähetä</button>
                    </div>

                </div>
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
            </div>
        </>
    )
}

export default App