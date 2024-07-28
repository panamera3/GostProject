import "./Login.css";
import LeftColumnLogReg from "../../components/LeftColumnLogReg/LeftColumnLogReg";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserRole from "../../types/user/userRole";
import { toast } from "react-toastify";
import { BtnBlue, Input } from "../../components/styles/styled_components";
import { eyeClosedIcon, eyeIcon } from "../../assets/images";

const Login = () => {
  const navigate = useNavigate();

  const usernameLoginInputRef = useRef();
  const passwordLoginInputRef = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [fieldValidity, setFieldValidity] = useState({
    username: true,
    password: true,
  });

  const loginUser = () => {
    const username = usernameLoginInputRef.current.value;
    const password = passwordLoginInputRef.current.value;
    if (!username) {
      toast.error("Заполните поле с логином");
      return;
    }
    if (!password) {
      toast.error("Заполните поле с паролем");
      return;
    }

    axios({
      method: "post",
      responseType: "json",
      url: `/api/Auth/AuthUser`,
      data: {
        login: `${username}`,
        password: `${password}`,
      },
    })
      .then((user) => {
        const userRole = Object.keys(UserRole).find(
          (key) => UserRole[key] === user.data.role
        );
        localStorage.setItem("id", user.data.id);
        localStorage.setItem("workCompanyID", user.data.workCompanyID);
        localStorage.setItem("role", userRole);
        localStorage.setItem("isConfirmed", user.data.isConfirmed);
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401)
          toast.error("Неверный логин и/или пароль");
        else toast.error("Возникла ошибка. Попробуйте войти ещё раз позднее.");
      });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const username = usernameLoginInputRef.current.value;
    const password = passwordLoginInputRef.current.value;

    if (!username) {
      setFieldValidity((prevState) => ({
        ...prevState,
        username: false,
      }));
      toast.error("Заполните поле с логином");
    } else {
      setFieldValidity((prevState) => ({
        ...prevState,
        username: true,
      }));
    }

    if (!password) {
      setFieldValidity((prevState) => ({
        ...prevState,
        password: false,
      }));
      toast.error("Заполните поле с паролем");
    } else {
      setFieldValidity((prevState) => ({
        ...prevState,
        password: true,
      }));
    }

    if (username && password) {
      loginUser();
    }
  };

  return (
    <>
      <LeftColumnLogReg login>
        <div className="left_column_log_reg_children">
          <form onSubmit={submitHandler} id="login_form">
            <div className="left_column_log_reg_children_form">
              <div className="test_name">
                <h2>Вход</h2>
              </div>
              <div className="test_name">
                <Input
                  name="login"
                  id="login_input"
                  type="login"
                  ref={usernameLoginInputRef}
                  placeholder="Логин"
                  isInvalid={!fieldValidity.username}
                />
                <div style={{ position: "relative" }}>
                  <Input
                    name="password"
                    id="password_input"
                    type={showPassword ? "text" : "password"}
                    ref={passwordLoginInputRef}
                    placeholder="Пароль"
                    isInvalid={!fieldValidity.password}
                  />
                  <img
                    src={showPassword ? eyeIcon : eyeClosedIcon}
                    alt="eye"
                    id="eye_icon"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>
              <BtnBlue type="submit">Войти</BtnBlue>
            </div>
          </form>
        </div>
      </LeftColumnLogReg>
    </>
  );
};

export default Login;
