import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import darkIcon from '../assets/dark_mode.svg'
import lightIcon from '../assets/light_mode.svg'

function Etusivu() {

  //dark mode -tila, oletusarvo luetaan localStoragesta
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')

  //Vaihtaa teemaa (light/dark) ja tallentaa valinnan local storageen
  //aina kun darkMode-tila muuttuu
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  return (
    <div className="etusivu">
      <StyledHeader>
        <h2>Tervetuloa</h2>
        {/* Näytetään aurinko/kuu-ikoni sen mukaan, kumpi teema on käytössä */}
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
      </StyledHeader>

      <ValintaBoksit>
        <Lootat>
          <div>
            <Link to="/mielialatracker"><button>Mieliala tracker</button></Link>
            <TekstiLoota>
              <p>
                Seuraa omaa hyvinvointiasi päivittäin. Valitse päivämäärä, arvioi
                mielialasi asteikolla 1–5 ja merkitse kuinka monta tuntia nukuit
                edellisenä yönä. Kaikki merkinnät tallentuvat listaan, josta näet
                helposti mielialasi ja unesi kehityksen ajan kuluessa.
              </p>
            </TekstiLoota>
          </div>
        </Lootat>
        <Lootat>
          <div>
            <Link to="/paivakirja"><button>Päiväkirja</button></Link>
            <TekstiLoota>
              <p>
                Kirjaa ajatuksiasi ja päivän tapahtumia omaan päiväkirjaan. Valitse
                päivämäärä ja kirjoita vapaasti fiiliksistäsi, tekemisistäsi tai
                mistä tahansa mielessä pyörivästä. Merkinnät tallentuvat listaan,
                josta voit myöhemmin selailla päiväkirjan merkkauksia.
              </p>
            </TekstiLoota>
          </div>
        </Lootat>
      </ValintaBoksit>

    </div>
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
    padding: 0 20px;

    img {
        margin-left: auto;
        margin-right: 10px;
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

const ThemeSwitch = styled.label`
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;

    img {
        margin-right: 10px;
    }

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

const Lootat = styled.div`
    background-color: var(--card-bg);
    color: var(--text);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;
    border-radius: 10px;
    width: 35rem;
    
    height: 400px;
    box-shadow: 5px 5px var(--shadow);
    min-height: 400px;

    @media (max-width: 1200px) {
        width: 90%;
        max-width: 30rem;
        margin-top: 10px;
    }

    > div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    a button {
        border: none;
        background-color: rgb(126, 24, 177);
        box-shadow: 3px 2px rgb(189, 141, 213);
        color: white;
        border-radius: 5px;
        padding: 20px 50px;
        font-size: 1.3rem;
        font-weight: 600;
        cursor: pointer;
        margin-bottom: 20px;
    }
`

const TekstiLoota = styled.div`
    background-color: color-mix(in srgb, var(--card-bg) 90%, black);
    border-radius: 10px;
    padding: 25px 30px;
    max-width: 420px;

    p {
        margin: 0;
        font-size: 1.1rem;
        line-height: 1.7;
        text-align: center;
        color: var(--text);
        opacity: 0.9;
    }
`

const ValintaBoksit = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 30px;

    @media (max-width: 1200px) {
        flex-direction: column;
        align-items: center;
    }
`

export default Etusivu