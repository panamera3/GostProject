import { useEffect, useState } from "react";
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import "./EditNotification.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditNotification = () => {
  const params = useParams();

  const [notification, setNotification] = useState();

  useEffect(() => {
    /*
    axios({
        method: "get",
        url: `/api/User/GetUser/${params.id}`,
        //headers: { Authorization: `Bearer ${userToken}` },
      })
        .then((user) => {
          setUser(user.data);
        })
        .catch((error) => {
          console.log(error);
        });
        */
  }, []);

  return (
    <>
      <HeaderAdmin />
      <div className="body_container">
        <p>Редактирование заявки</p>
        <div className="notification_container">
          <div>
            <p>
              <b>ФИО пользователя</b>
            </p>
            <p>1</p>
          </div>
          <div>
            <p>
              <b>Логин</b>
            </p>
            <p>7</p>
          </div>
          <div>
            <p>
              <b>Отдел</b>
            </p>
            <p>8</p>
          </div>
          <div>
            <p>
              <b>Роль пользователя</b>
            </p>
            <p>7</p>
          </div>
        </div>
        <div className="buttons">
          <button className="btn_blue">Принять заявку</button>
          <button className="btn_darkGray">Отклонить</button>
        </div>
      </div>
    </>
  );
};

export default EditNotification;
