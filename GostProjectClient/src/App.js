// libraries
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
// styles
import "./App.css";
// pages
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import Home from "./pages/Home/Home";

function App() {
  return (
    <>
      <div className="body">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/home" element={<Home />} />
            перенаправлять пользователя на главную страницу, если ввёл
            несуществующий путь
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
