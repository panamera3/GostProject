// libraries
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
// styles
import "./App.css";
// pages
import Login from "./pages/Login/Login";

const router = createHashRouter([{ path: "/login", element: <Login /> }, { path: "/", element: <Login /> },]);

function App() {
  return (
    <>
      <div className="body">
        <RouterProvider router={router}>
          <Routes>
            <Route path="/login" element={<Login />} />
            перенаправлять пользователя на главную страницу, если ввёл
            несуществующий путь
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </RouterProvider>
      </div>
    </>
  );
}

export default App;
