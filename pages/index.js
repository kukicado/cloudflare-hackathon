import client from "../lib/mongodb";
import { useEffect, useState } from 'react'

export default function Home({ results }) {
  const [apiData, setApiData] = useState(null)
  const [userPreferences, setUserPreferences] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useState(results)

  const [isLoading, setIsLoading] = useState(false)

  const testMovie = async (movieTitle) => {
    setIsLoading(true)
    window.scrollTo(0, 0)
    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieTitle: movieTitle,
          userPreferences: userPreferences,
        }),
      })
      const data = await response.json()
      setApiData(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const searchMovies = async () => {
    try {
      const response = await fetch(`/api/movies?search=${searchQuery}`)
      const data = await response.json()
      setMovies(data)
    } catch (error) {
      console.error('Error searching movies:', error)
    }
  }

  return (
      <main className={`flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-400 via-yellow-300 to-blue-500`}>
        <div className="mb-8 flex flex-col space-y-4 w-full max-w-2xl">
          <div className="flex flex-col space-y-2">
            <label htmlFor="preferences" className="text-sm font-semibold text-gray-700">Your Preferences</label>
            <input
              id="preferences"
              type="text"
              value={userPreferences}
              onChange={(e) => setUserPreferences(e.target.value)}
              placeholder="E.g., action, comedy, sci-fi"
              className="p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="search" className="text-sm font-semibold text-gray-700">Search Movies</label>
            <div className="flex space-x-2">
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter movie title"
                className="flex-grow p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
              <button 
                onClick={searchMovies} 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              >
                Search
              </button>
            </div>
          </div>
        </div>
        {apiData && !isLoading && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Movie Analysis</h3>
            <pre className="whitespace-pre-wrap">{apiData.response}</pre>
          </div>
        )}
              {isLoading && !apiData && (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                  <p className="text-xl font-semibold text-gray-700">Analyzing your request...</p>
                  <div className="text-lg text-gray-600">
                    <span className="inline-block animate-pulse">Crunching</span>
                    <span className="inline-block animate-pulse delay-75">the</span>
                    <span className="inline-block animate-pulse delay-150">numbers</span>
                    <span className="inline-block animate-bounce delay-300">🎬</span>
                  </div>
                </div>
              )}        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {movies.map((movie, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md cursor-pointer" onClick={() => testMovie(movie.title)}>
              <img src={movie.poster || "https://img.freepik.com/premium-vector/404-error-web-page-template-with-cute-cat_540634-1.jpg"} alt={`${movie.title} poster`} className="w-full h-auto mb-2 rounded" />
              <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
              <p className="text-gray-600">{movie.score}</p>
            </div>
          ))}
        </div>
      </main>
  )
}

export const getServerSideProps  = async () => {
  try {
    await client.connect();
    const database = client.db("sample_mflix")
    const collection = database.collection("movies")

    const pipeline = [
        {
          "$search": {
            index: "default",
            text: {
              query: "computer",
              path: {
                wildcard: "*"
              }
            }
          }
        },
      {
        $limit: 100
      },
      {
        $project: {
          _id: 0,
          title: 1,
          description: 1,
          poster: 1,
          fullplot: 1,
          score: { $meta: "searchScore" }
        }
      }
    ]

    const results = await collection.aggregate(pipeline).toArray()

    console.log(results)

    return {
      props: { results },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
};