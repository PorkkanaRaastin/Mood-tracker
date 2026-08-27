import { Link } from 'react-router-dom'

function Paivakirja() {
  return (
    <div>
      <h1>Päiväkirja</h1>
      <p>Tähän tulee päiväkirja-toiminnallisuus.</p>
      <Link to="/">Takaisin etusivulle</Link>
    </div>
  )
}

export default Paivakirja