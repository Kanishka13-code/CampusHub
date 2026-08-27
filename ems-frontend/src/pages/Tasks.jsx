import { useEffect, useState } from "react"
import api from "../services/api"

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await api.get("/api/tasks")
      setTasks(response.data)
    } catch (error) {
      setError("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      if (editingId) {
        const task = tasks.find((task) => task.id === editingId)

        const response = await api.put(`/api/tasks/${editingId}`, {
          ...task,
          title,
          description,
          dueDate,
        })

        setTasks(
          tasks.map((item) =>
            item.id === editingId ? response.data : item
          )
        )

        setEditingId(null)
      } else {
        await api.post("/api/tasks", {
          title,
          description,
          dueDate,
          completed: false,
        })

        fetchTasks()
      }

      setTitle("")
      setDescription("")
      setDueDate("")
    } catch (error) {
      setError(
        editingId
          ? "Failed to update task"
          : "Failed to add task"
      )
    }
  }

  const handleEditTask = (task) => {
    setEditingId(task.id)
    setTitle(task.title)
    setDescription(task.description)
    setDueDate(task.dueDate)
  }

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`)
      setTasks(tasks.filter((task) => task.id !== id))
    } catch (error) {
      setError("Failed to delete task")
    }
  }

  const handleCompleteTask = async (task) => {
    try {
      const response = await api.put(`/api/tasks/${task.id}`, {
        ...task,
        completed: !task.completed,
      })

      setTasks(
        tasks.map((item) =>
          item.id === task.id ? response.data : item
        )
      )
    } catch (error) {
      setError("Failed to update task")
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setTitle("")
    setDescription("")
    setDueDate("")
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">
        Tasks
      </h2>

      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <h3 className="text-xl font-semibold">
          {editingId ? "Edit Task" : "Add Task"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded border p-3"
            required
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded border p-3"
            required
          />

          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded border p-3 md:col-span-2"
            rows="3"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {editingId ? "Update Task" : "Add Task"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded bg-gray-500 px-5 py-3 font-semibold text-white hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {error && (
        <p className="mt-4 rounded bg-red-100 p-4 text-red-600">
          {error}
        </p>
      )}

      {loading && (
        <p className="mt-6 text-gray-600">
          Loading tasks...
        </p>
      )}

      {!loading && tasks.length === 0 && (
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <p className="text-gray-600">No tasks found.</p>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Due Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-t">
                  <td className="px-6 py-4">{task.title}</td>

                  <td className="px-6 py-4">
                    {task.description}
                  </td>

                  <td className="px-6 py-4">
                    {task.dueDate}
                  </td>

                  <td className="px-6 py-4">
                    {task.completed ? "Completed" : "Pending"}
                  </td>

                  <td className="flex gap-2 px-6 py-4">
                    <button
                      onClick={() => handleCompleteTask(task)}
                      className="rounded bg-green-600 px-3 py-2 text-white"
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>

                    <button
                      onClick={() => handleEditTask(task)}
                      className="rounded bg-yellow-500 px-3 py-2 text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="rounded bg-red-500 px-3 py-2 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Tasks