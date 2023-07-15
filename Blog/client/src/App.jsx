import './App.css'
import {Route, Routes} from 'react-router-dom'
import Layout from './Components/Layout'
import IndexPage from './Components/IndexPage'
import LoginPage from './Components/LoginPage'
import Register from './Components/Register'
import { UserContextProvider } from './Components/UserContext'
import CreatePost from './Components/CreatePost'
import PostPage from './Components/PostPage'
import EditPage from './Components/EditPage'

function App() {

  return (
    <UserContextProvider>
      <Routes>
      <Route path='/' element={<Layout/>}>
      <Route index element={<IndexPage/>}/>
      <Route path={'/login'} element={<LoginPage/>}/>
      <Route path={'/register'} element={<Register/>}/>
      <Route path={'/create'} element={<CreatePost/>}/>
      <Route path={'/post/:id'} element={<PostPage/>}/>
      <Route path={'/edit/:id'} element={<EditPage/>}/>
      </Route>
    </Routes>
    </UserContextProvider>

    
   
  )
}

export default App
