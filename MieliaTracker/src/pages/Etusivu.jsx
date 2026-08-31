import styled from 'styled-components'
import { useState, useEffect } from 'react'
import smile from '../assets/smile.svg'
import diary from '../assets/book.svg'
import { EtusivuHeader, MieliLoota, PaivakirjaLoota } from '../components/EtusivuComponents'

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
    <div>
      <StyledHeader>
        <EtusivuHeader darkMode={darkMode} setDarkMode={setDarkMode} />
      </StyledHeader>

      <ValintaBoksit>
        <MieliLoota smile={smile} />
        <PaivakirjaLoota diary={diary} />
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