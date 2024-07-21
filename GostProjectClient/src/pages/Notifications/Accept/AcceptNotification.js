import { useEffect, useState } from "react";
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import "./AcceptNotification.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BodyContainer,
  BtnBlue,
  BtnDarkGray,
} from "../../../components/styles/styled_components";

const AcceptNotification = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    axios({
      method: "get",
      url: `/api/Notification/GetNotification/${params.id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        setNotification(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params.id]);

  const acceptUser = () => {
    const newRole =
      selectedRole !== null ? selectedRole : notification.user?.role;
    axios({
      method: "post",
      url: `/api/Notification/AcceptUser/?notificationID=${params.id}&role=${newRole}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        toast.success("Заявка была успешно принята!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          progress: undefined,
          pauseOnHover: false,
          draggable: false,
        });
        navigate("/notifications");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const rejectUser = () => {
    axios({
      method: "post",
      url: `/api/Notification/RejectUser/?notificationID=${params.id}`,
    })
      .then((response) => {
        toast.success("Заявка была отклонена");
        navigate("/notifications");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <HeaderAdmin />
      <BodyContainer>
        <div className="activities_container">
          <a href="/notifications">Назад</a>
          <p>Редактирование заявки</p>
        </div>
        <div className="notification_container">
          {notification && (
            <>
              <div>
                <p>
                  <b>ФИО пользователя</b>
                </p>
                <p>{notification.user?.fullName}</p>
              </div>
              <div>
                <p>
                  <b>Логин</b>
                </p>
                <p>{notification.user?.login}</p>
              </div>
              <div>
                <p>
                  <b>Отдел</b>
                </p>
                <p>{notification.user?.department}</p>
              </div>
              <div>
                <p>
                  <b>Роль пользователя</b>
                </p>
                <select
                  id="role"
                  name="role"
                  value={
                    selectedRole !== null
                      ? selectedRole
                      : notification.user?.role
                  }
                  onChange={(e) => setSelectedRole(parseInt(e.target.value))}
                >
                  <option value={1}>Администратор</option>
                  <option value={2}>Обычный пользователь</option>
                </select>
              </div>
            </>
          )}
        </div>
        <div className="buttons">
          <BtnBlue onClick={acceptUser}>Принять заявку</BtnBlue>
          <BtnDarkGray onClick={rejectUser}>Отклонить</BtnDarkGray>
        </div>
      </BodyContainer>
    </>
  );
};

export default AcceptNotification;
