import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { externalLinkIcon } from "../../assets/images";
import Table from "../Table/Table";

const NotificationsTable = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const companyID = localStorage.getItem("workCompanyID");
    axios({
      method: "get",
      url: `/api/Notification/GetUnreadNotifications/?companyID=${companyID}`,
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
