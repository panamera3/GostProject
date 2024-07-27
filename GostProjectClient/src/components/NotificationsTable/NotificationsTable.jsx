import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { externalLinkIcon } from "../../assets/images";
import Table from "../Table/Table";
import { NoDataContainer } from "../styles/styled_components";

const NotificationsTable = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios({
      method: "get",
      url: `/api/Notification/GetUnreadNotifications`,
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
              src={externalLinkIcon}
              alt="view"
              onClick={() => {
                navigate(`/notification/${notification.id}`);
              }}
            />
          </td>
        </tr>
      ));
    } else {
      return (
        <NoDataContainer>
          <p>У Вашей организации нет новых заявок</p>
        </NoDataContainer>
      );
    }
  };

  return (
    <>
      <p>Список заявок</p>
      <Table
        className="notificationsTable"
        headers={["№", "ФИО", "Логин", ""]}
        renderBody={renderNotificationsTable}
      />
    </>
  );
};

export default NotificationsTable;
