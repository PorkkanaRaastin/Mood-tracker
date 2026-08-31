import { Link } from 'react-router-dom'
import styled from 'styled-components'
import trashIcon from '../assets/trash.svg'
import darkIcon from '../assets/dark_mode.svg'
import lightIcon from '../assets/light_mode.svg'

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

const MielialaHeader = ({ darkMode, setDarkMode }) => {
    return (
        <>
            <Link to="/"><button>Etusivu</button></Link>
            <h3>Mieliala tracker</h3>
            <img
                src={darkMode ? darkIcon : lightIcon}
                alt={darkMode ? 'dark mode' : 'light mode'}
                style={!darkMode ? { filter: 'brightness(0.5)' } : undefined}
            />
            {/* Dark mode -kytkin */}
            <ThemeSwitch>
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider"></span>
            </ThemeSwitch>
        </>
    )
}

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

const getSleepColor = (sleepValue) =>
    sleepOptions.find((option) => option.value === sleepValue)?.color

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
                        style={{ background: `linear-gradient(to right, ${getMoodColor(entry.mood)} 45%, ${getSleepColor(entry.sleep)})` }}
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

export {MielialaHeader, EntriesList, MoodButtons, SleepButtons}