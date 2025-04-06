import { useState } from 'react'
import CourseTree from './components/CourseTree'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <CourseTree />
    </div>
  )
}

export default App
