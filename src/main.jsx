import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './screens/ErrorPage.jsx'
import Authentication from './screens/Authentication.jsx'
import { AuthenticationMode } from './screens/Authentication.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import UserProvider from './context/UserProvider.jsx'
import BrowseMovies from './components/BrowseMovies.jsx'
import Screenings from './components/Screenings.jsx'
import GenreMoviesPage from './components/GenreMoviePage.jsx'
import UserAccount from './screens/UserAccount.jsx'
import Home from './components/Home.jsx'
//creating router for navigation and authentication
const router = createBrowserRouter([
  {
    errorElement: <ErrorPage/>
  },
  {
    path: 'screenings',
    element: <Screenings/>
  },
  {
    path: `genre/:genreId`,
    element: <GenreMoviesPage/>
  },
  {
    path: 'search',
    element: <BrowseMovies/>
  },
  {
    path: '',
    element: <Home/>
  },
  {
    path: 'signup',
    element: <Authentication authenticationMode={AuthenticationMode.Register}/>
  },
  {
    path: 'signin',
    element: <Authentication authenticationMode={AuthenticationMode.Login}/>
  },
  {
    element: <ProtectedRoute/>,
    children: [
      {
        path: 'account',
        element: <UserAccount />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router}/>
    </UserProvider>
  </StrictMode>,
)
