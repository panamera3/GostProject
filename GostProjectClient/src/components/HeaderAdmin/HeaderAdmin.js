import "./HeaderAdmin.css";
import userImg from "../../images/user.svg";
import notification from "../../images/notification.svg";
import notificationActive from "../../images/notificationActive.svg";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import axios from "axios";

const HeaderAdmin = ({ user }) => {
  const header = useRef();
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalNotificationOpen, setModalNotificationOpen] = useState(false);
  const [notificationsCount, setnotificationsCount] = useState(0);

  useEffect(() => {
    const companyID = localStorage.getItem("workCompanyID");
    axios({
      method: "get",
      url: `/api/Notification/GetUnreadNotifications/?companyID=${companyID}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((notifications) => {
        setnotificationsCount(notifications.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getNotificationCountText = (count) => {
    const cases = [2, 0, 1, 1, 1, 2];
    const titles = ["новая заявка", "новые заявки", "новых заявок"];
    return `У вас ${count} ${
      titles[
        count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]
      ]
    }`;
  };

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
    localStorage.setItem("token", "");
    localStorage.setItem("id", "");
    localStorage.setItem("workCompanyID", "");
    localStorage.setItem("role", "");
    localStorage.setItem("isConfirmed", "");
    localStorage.setItem("searchGosts", "");

    navigate("/login");
  };

  return (
    <>
      <div className="header" ref={header}>
        <div className="navigation-container">
          <a href="/home" className="a_header">
            Все документы
          </a>
          {!user && <a href="/gostAdd">Создать документ</a>}

          {!user && (
            <>
              <a href="/search">Поиск</a>
              <a href="/archive">Архив</a>
              <a href="/userProfiles">Пользователи</a>
              <a href="/activity">Активность</a>
            </>
          )}
        </div>
        <div id="header-images">
          {!user && (
            <>
              {!(notificationsCount > 0) && (
                <img
                  alt="Notifications"
                  src={notification}
                  onClick={() => openModalNotification()}
                />
              )}

              {notificationsCount > 0 && (
                <img
                  alt="Unread notifications"
                  src={notificationActive}
                  onClick={() => openModalNotification()}
                />
              )}
            </>
          )}
          <img alt="User" src={userImg} onClick={() => openModalCard()} />
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
                {getNotificationCountText(notificationsCount)}
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
            <button onClick={exitHandler}>Выход</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default HeaderAdmin;
