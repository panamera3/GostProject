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
import axios from "axios";

const HeaderAdmin = (props) => {
  const header = useRef();
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalNotificationOpen, setModalNotificationOpen] = useState(false);
  const [notificationsCount, setnotificationsCount] = useState(0);

  useEffect(() => {
    const companyID = localStorage.getItem("workCompanyID");
    axios({
      method: "get",
      url: `/api/Notification/GetNotifications/?companyID=${companyID}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((notifications) => {
        console.log(notifications.data.length);
        setnotificationsCount(notifications.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const openModalCard = () => {
    setModalOpen(true);
  };
  const closeModalCard = () => {
    setModalOpen(false);
  };

  const openModalNotification = () => {
    setModalNotificationOpen(true);
  };
  const closeModalNotification = () => {
    setModalNotificationOpen(false);
  };

  const exitHandler = () => {
    console.log(123234);
    localStorage.setItem("token", "");
    localStorage.setItem("id", "");
    localStorage.setItem("workCompanyID", "");
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
                onClick={() => openModalNotification()}
              />
            </>
          )}
          <img alt="User" src={user} onClick={() => openModalCard()} />
        </div>
      </div>
      {isModalNotificationOpen && (
        <Modal
          isOpen={isModalNotificationOpen}
          onClose={closeModalNotification}
          contentClassName="notification"
        >
          <div className="modalNotification">
            {notificationsCount > 0 && (
              <a href="/notifications">
                У вас {notificationsCount} новых заявок
              </a>
            )}
            {!(notificationsCount > 0) && <p>У вас нет новых заявок</p>}
          </div>
        </Modal>
      )}

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
