import { useEffect, useState } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import About from "./components/About"
import AddTask from "./components/AddTask"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Tasks from "./components/Tasks"

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [burrito, setBurrito] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setBurrito(tasksFromServer)
    }

    getTasks()
  }, [])

  //fetch tasks
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks")
    const data = await res.json()

    return data
  }

  //fetch task
  const fetchTask = async id => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data
  }

  //add task
  const addTask = async task => {
    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(task),
    })

    const data = await res.json()

    setBurrito([...burrito, data])

    //const id = Math.floor(Math.random() * 10000) + 1
    //const newTask = { id, ...task }
    //setBurrito([...burrito, newTask])
  }

  //delete task
  const deleteTask = async id => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    })

    setBurrito(burrito.filter(task => task.id !== id))
  }

  //toggle reminder
  const toggleReminder = async id => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updTask),
    })

    const data = await res.json()

    setBurrito(
      burrito.map(task =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    )
  }

  return (
    <Router>
      <div className="container">
        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />
        <Route
          path="/"
          exact
          render={props => (
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {burrito.length > 0 ? (
                <Tasks
                  spoons={burrito}
                  onDelete={deleteTask}
                  onToggle={toggleReminder}
                />
              ) : (
                "No Tasks - Relax!"
              )}
            </>
          )}
        />
        <Route path="/about" component={About} />
        <Footer />
      </div>
    </Router>
  )
}

export default App
