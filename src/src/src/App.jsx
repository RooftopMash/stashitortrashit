import { useState } from 'react'
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <div className="app">
      <h1>Stash or Trash???</h1>
      <p>{loggedIn ? 'Welcome back!' : 'Please log in to review'}</p>
    </div>
  )
}

export default App
