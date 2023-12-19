// styles
import "./Header.css";
// images

// libraries
import { useNavigate } from "react-router-dom";

const Header = ({ children }) => {
  const navigate = useNavigate();

  const showUserModal = () => {
    console.log("user");
  };
  //import UserIcon from "./user.svg"
  //src={UserIcon}

  return (
    <div className="header">
      <div>
        <a href="/registration">Создать документ</a>
        <a href="/login">Поиск по документам</a>
        <a href="/">Архив</a>
        <a href="/">Пользователи</a>
      </div>
      <div>
        <img alt="User"  onClick={() => showUserModal} />
      </div>
    </div>
  );
};

export default Header;
