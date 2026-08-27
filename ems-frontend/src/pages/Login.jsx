import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../services/api"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      })

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("username", response.data.username)
      localStorage.setItem("role", response.data.role)

      const studentsResponse = await api.get("/api/students")

      const student = studentsResponse.data.find(
        (student) =>
          student.email === username ||
          student.firstName?.toLowerCase() === username.toLowerCase()
      )

      if (student) {
        localStorage.setItem("studentId", student.id)
      }

      navigate("/")
    } catch (error) {
      console.error(error)
      setError("Invalid username or password")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-blue-600">
          CampusHub
        </h1>

        <h2 className="mt-2 text-2xl font-bold">
          Login
        </h2>

        {error && (
          <p className="mt-4 rounded bg-red-100 p-3 text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded border p-3"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-3"
            required
          />

          <button
            type="submit"
            className="w-full rounded bg-blue-600 p-3 font-semibold text-white"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login