// styles
import "./HeaderAdmin.css";
// images
import user from "../../images/user.svg";
import notification from "../../images/notification.svg";
import notificationActive from "../../images/notificationActive.svg";
// libraries
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Modal from "../Modal/Modal";

const HeaderAdmin = (props) => {
  const header = useRef();
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);

  const openModalCard = () => {
    setModalOpen(true);
  };
  const closeModalCard = () => {
    setModalOpen(false);
  };

  const exitHandler = () => {
    console.log(123234);
    localStorage.setItem("token", "");
    localStorage.setItem("id", "");
    localStorage.setItem("role", "");
    navigate("/login");
  };

  return (
    <>
      <div className="header" ref={header}>
        <div>
          <a href="/home" className="a_header">
            Все документы
          </a>
          {!props.user && <a href="/gostAdd">Создать документ</a>}

          {!props.user && (
            <>
              <a href="/search">Поиск</a>
              <a href="/archive">Архив</a>
              <a href="/userProfiles">Пользователи</a>
              <a href="/activity">Активность</a>
            </>
          )}
        </div>
        <div id="header-images">
          {!props.user && (
            <>
              <img
                alt="Notifications"
                src={notification}
                onClick={() => navigate("/notifications")}
              />
              {/*
              
              <img
                alt="Notifications"
                src={notificationActive}
                onClick={() => openModalCard()}
              />
              
              */}
            </>
          )}
          <img alt="User" src={user} onClick={() => openModalCard()} />
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModalCard}
          contentClassName="profile"
        >
          <div className="modalProfile">
            {localStorage.getItem("role") == "Admin" && (
              <a href="/myProfile">Мой профиль</a>
            )}
            <a href="/favourites">Избранное</a>
            <p onClick={exitHandler}>Выход</p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default HeaderAdmin;
