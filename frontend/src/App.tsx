
import { BrowserRouter, Route, Routes  } from "react-router-dom"
import Signin from "./Pages/Signin"
import "./App.css"
import UserDashboard from "./Pages/UserDashboard"
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element= {<Signin/>}></Route>
      <Route path="/user/Dashboard" element = {<UserDashboard/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App