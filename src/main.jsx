import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
import Showtime from './components/ShowTime.jsx'
import MoviePage from './components/MoviePage.jsx'
import CreateGroup from './screens/CreateGroup.jsx'
import GroupList from './screens/GroupList.jsx'
import GroupView from './screens/GroupView.jsx'
import GroupAdminPanel from './screens/GroupAdminPanel.jsx'
import BrowseReviewPage from './components/BrowseReview.jsx'
import AddGroupPosts from './screens/AddGroupPost.jsx'

//creating router for navigation and authentication
const router = createBrowserRouter([
  {
    errorElement: <ErrorPage/>
  },
  {
    path: 'movie/:movieId',  
    element: <MoviePage />
  },
  {
    path: 'showtime/:id',
    element: <Showtime/>
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
    path: 'groups',
    element: <GroupList/>
  },
  {
    path: '/reviews/:movieId',
    element: <BrowseReviewPage />
  },
  {
    element: <ProtectedRoute/>,
    children: [
      {
        path: 'account',
        element: <UserAccount />
      },
      {
        path: 'account/creategroup',
        element: <CreateGroup/>
      },
      {
        path: 'groups/:groupId',
        element: <GroupView/>
      },
      {
        path: 'groups/admin/:groupId',
        element: <GroupAdminPanel/>
      },
      {
        path: 'groups/newpost/:groupId',
        element: <AddGroupPosts/>
      },
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
