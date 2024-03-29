import { useEffect, useState } from "react";
import HeaderUser from "../../components/Header/HeaderUser";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import "./MyProfile.css";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const MyProfile = () => {
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
      {localStorage.getItem("role") == "Admin" ? (
        <HeaderAdmin />
      ) : (
        <HeaderUser />
      )}
      <div className="body_container">
        {Object.keys(user).map((key) => (
          <div className="userFields">
            <p>{key}:</p><p>{user[key]}</p>
          </div>
        ))}
      </div>
    </>
  );
};
export default MyProfile;
