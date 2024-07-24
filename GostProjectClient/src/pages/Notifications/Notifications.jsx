import { useEffect, useState, useRef } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import "./Notifications.css";
import axios from "axios";
import NotificationsTable from "../../components/NotificationsTable/NotificationsTable";
import { BodyContainer } from "../../components/styles/styled_components";

const Notifications = () => {
  const [user, setUser] = useState({});
  const hasRequestedNotifications = useRef(false);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (!hasRequestedNotifications.current) {
      axios({
        method: "post",
        url: `/api/Notification/ReadNotifications/?userID=${userId}`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((notificationLastSeen) => {
          hasRequestedNotifications.current = true;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    axios({
      method: "get",
      url: `/api/User/GetUser/${userId}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((user) => {
        setUser(user.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <HeaderAdmin />
      <BodyContainer>
        <NotificationsTable />
      </BodyContainer>
    </>
  );
};
export default Notifications;
