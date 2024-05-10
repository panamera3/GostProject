import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import externalLink from "../../images/external-link.svg";

const NotificationsTable = () => {
  const [notifications, setNotifications] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    /*
    axios({
      method: "get",
      url: `https://localhost:7243/api/GetNotifications/`, // userID/companyID ?
      //headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((notifications) => {
        console.log(notifications.data);
        setNotifications(notifications.data);
      })
      .catch((error) => {
        console.log(error);
      });
      */
  }, []);

  const renderNotificationsTable = () => {
    if (notifications) {
      return notifications.map((notification) => (
        <tr key={notification.id}>
          <td>
            <p>{notification.id}</p>
          </td>
          <td>
            <p>{notification.fullname}</p>
          </td>
          <td>
            <p>{notification.login}</p>
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
      <table className="gostsTable">
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
