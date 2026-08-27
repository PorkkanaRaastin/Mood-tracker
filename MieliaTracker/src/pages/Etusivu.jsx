import { Link } from 'react-router-dom'

function Etusivu() {
  return (
    <div className="etusivu">
      <h1>Tervetuloa</h1>
      <p>Valitse mihin haluat siirtyä:</p>
      <div className="valikkoLinkit">
        <Link to="/mielialatracker">Mieliala tracker</Link>
        <Link to="/paivakirja">Päiväkirja</Link>
      </div>
    </div>
  )
}

export default Etusivu