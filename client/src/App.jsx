import { Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Error from './pages/Error.jsx';
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from "./pages/Profile.jsx";
import RecipeCard from "./components/RecipeCard.jsx";
import RecipeDetails from "./pages/RecipeDetails.jsx";
import About from "./pages/About.jsx";

function App() {

  return (
    <>
     <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='home' element={
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        }/>
        <Route path='/login' element={<Login/>}/>
        <Route path="/profile" element={<Profile/>} />
        <Route path="/recipes" element={<RecipeCard type='all'/>} />
        <Route path="/recipes/:_id" element={<RecipeDetails/>} />
        <Route path="/about" element={<About/>} />
        {/*<Route path="/createRecipe" element={<CreateRecipe/>} />*/}
        <Route path="*" element={<Error />} />

     </Routes>
    </>
  )
}

export default App;
