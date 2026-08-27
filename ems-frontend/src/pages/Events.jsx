import { useEffect, useState } from "react"
import api from "../services/api"

function Events() {
  const [events, setEvents] = useState([])
  const [joinedEvents, setJoinedEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const studentId = localStorage.getItem("studentId")

  useEffect(() => {
    fetchEvents()
    fetchRegistrations()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await api.get("/api/events")
      setEvents(response.data)
    } catch (error) {
      setError("Failed to load events")
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistrations = async () => {
    if (!studentId) return

    try {
      const response = await api.get(
        `/api/event-registrations/student/${studentId}`
      )

      setJoinedEvents(
        response.data.map((registration) => registration.eventId)
      )
    } catch (error) {
      console.log("Failed to load registrations")
    }
  }

  const handleJoin = async (eventId) => {
    try {
      await api.post("/api/event-registrations", {
        studentId: Number(studentId),
        eventId: Number(eventId),
      })

      setJoinedEvents((previous) => [...previous, eventId])
    } catch (error) {
      setError("Failed to join event")
    }
  }

  const handleLeave = async (eventId) => {
    try {
      await api.delete("/api/event-registrations", {
        params: {
          studentId: Number(studentId),
          eventId: Number(eventId),
        },
      })

      setJoinedEvents((previous) =>
        previous.filter((id) => id !== eventId)
      )
    } catch (error) {
      setError("Failed to leave event")
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">
        Campus Events
      </h2>

      {loading && (
        <p className="mt-6 text-gray-600">
          Loading events...
        </p>
      )}

      {error && (
        <p className="mt-6 rounded bg-red-100 p-4 text-red-600">
          {error}
        </p>
      )}

      {!loading && events.length === 0 && (
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          No events available.
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const isJoined = joinedEvents.includes(event.id)

            return (
              <div
                key={event.id}
                className="rounded-lg bg-white p-6 shadow"
              >
                <h3 className="text-xl font-bold text-gray-800">
                  {event.title}
                </h3>

                <p className="mt-2 text-gray-600">
                  {event.description}
                </p>

                <p className="mt-4 text-sm text-gray-500">
                  Date: {event.date}
                </p>

                {isJoined ? (
                  <button
                    onClick={() => handleLeave(event.id)}
                    className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
                  >
                    Leave Event
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(event.id)}
                    className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
                  >
                    Join Event
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Events