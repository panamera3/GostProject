import { useEffect, useState } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import "./Notifications.css";
import axios from "axios";
import NotificationsTable from "../../components/NotificationsTable/NotificationsTable";

const Notifications = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem("id");
    axios({
      method: "get",
      url: `https://localhost:7243/api/User/GetUser/${userId}`,
      //headers: { Authorization: `Bearer ${userToken}` },
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
      <div className="body_container">
        <NotificationsTable />
      </div>
    </>
  );
};
export default Notifications;
