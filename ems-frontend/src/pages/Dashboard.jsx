import { Link } from "react-router-dom"

function Dashboard() {
  const username = localStorage.getItem("username")

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome, {username} 👋
        </h2>

        <p className="mt-2 text-gray-600">
          Manage your tasks and campus events from here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-xl font-bold text-gray-800">
            Tasks
          </h3>

          <p className="mt-2 text-gray-600">
            Create, update, complete and delete your tasks.
          </p>

          <Link
            to="/tasks"
            className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white"
          >
            View Tasks
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-xl font-bold text-gray-800">
            Campus Events
          </h3>

          <p className="mt-2 text-gray-600">
            Explore campus events and join the ones you like.
          </p>

          <Link
            to="/events"
            className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white"
          >
            View Events
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard