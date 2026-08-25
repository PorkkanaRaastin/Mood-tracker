import './App.css'
import { useState } from 'react'

function App() {

    const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  return (
    <>
    <header>
        <h3>Mieliala tracker</h3>
    </header>
    <div className = "moodBoksit">
        <div className = "valinnat">
            <h2>Mille päivälle haluat lisätä merkinnän?</h2>
            <p>Oletuksena merkintä lisätään tämän päivän päivämäärälle</p>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            
            <h2>Millainen mieliala sinulla on tänään?</h2>
            <div className ="moodBs">
                <button className ="moodB1">1</button>
                <button className ="moodB2">2</button>
                <button className ="moodB3">3</button>
                <button className ="moodB4">4</button>
                <button className ="moodB5">5</button>
            </div>

            <h2>Kuinka monta tuntia nukuit viime yönä?</h2>
            <div className ="moodBs">
                <button className ="moodB1">&lt;5</button>
                <button className ="moodB2">5-6</button>
                <button className ="moodB3">6-7</button>
                <button className ="moodB4">7-8</button>
                <button className ="moodB5">&gt;8</button>
            </div>
        </div>
        <div className ="merkinnat">
            <h2>Viimeisimmät merkinnät</h2>
        </div>
    </div>
    </>
  )
}

export default App