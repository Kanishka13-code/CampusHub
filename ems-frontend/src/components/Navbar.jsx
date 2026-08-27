import { Link, useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()
  const username = localStorage.getItem("username")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("role")
    localStorage.removeItem("studentId")

    navigate("/login")
  }

  return (
    <nav className="bg-blue-600 px-6 py-4 text-white shadow">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-bold">
          CampusHub
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="hover:text-blue-200">
            Dashboard
          </Link>

          <Link to="/tasks" className="hover:text-blue-200">
            Tasks
          </Link>

          <Link to="/events" className="hover:text-blue-200">
            Events
          </Link>

          <span className="hidden border-l border-blue-400 pl-4 sm:inline">
            {username}
          </span>

          <button
            onClick={handleLogout}
            className="rounded bg-red-500 px-4 py-2 hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar