
import { BrowserRouter, Route, Routes  } from "react-router-dom"
import Signin from "./Pages/Signin"
import "./App.css"
import UserDashboard from "./Pages/UserDashboard"
import UserProfile from "./Pages/UserProfile"
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element= {<Signin/>}></Route>
      <Route path="/user/Dashboard" element = {<UserDashboard/>}></Route>
      <Route path="/user/profile" element = {<UserProfile/>}></Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App