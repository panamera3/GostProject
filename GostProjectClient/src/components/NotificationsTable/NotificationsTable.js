import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import externalLink from "../../images/external-link.svg";

const NotificationsTable = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const companyID = localStorage.getItem("workCompanyID");
    axios({
      method: "get",
      url: `/api/Notification/GetUnreadNotifications/?companyID=${companyID}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((notifications) => {
        setNotifications(notifications.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const renderNotificationsTable = () => {
    if (notifications) {
      return notifications.map((notification, index) => (
        <tr key={notification.id}>
          <td>
            <p>{index + 1}</p>
          </td>
          <td>
            <p>{notification.user.fullName}</p>
          </td>
          <td>
            <p>{notification.user.login}</p>
          </td>
          <td>
            <img
              src={externalLink}
              alt="view"
              onClick={() => {
                navigate(`/notification/${notification.id}`);
              }}
            />
          </td>
        </tr>
      ));
    }
  };

  return (
    <>
      <p>Список заявок</p>
      <table className="notificationsTable">
        <thead>
          <tr>
            <th scope="col">№</th>
            <th scope="col">ФИО</th>
            <th scope="col">Логин</th>
            <th />
          </tr>
        </thead>
        <tbody>{renderNotificationsTable()}</tbody>
      </table>
    </>
  );
};

export default NotificationsTable;
