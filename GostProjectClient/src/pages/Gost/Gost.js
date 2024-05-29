// styles
import "./Gost.css";
// libraries
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GostTable from "../../components/GostTable/GostTable";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import HeaderUser from "../../components/Header/HeaderUser";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserRole from "../../types/user/userRole";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// components

const Gost = (props) => {
  const params = useParams();
  const navigate = useNavigate();

  const [isFavourite, setIsFavourite] = useState();

  useEffect(() => {
    axios({
      method: "post",
      url: `/api/Gost/AddRequest?gostID=${params.id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((gost) => {
        console.log("gost.data", gost.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios({
      method: "get",
      url: `/api/Gost/CheckFavouriteGosts/${localStorage.getItem(
        "id"
      )}/${params.id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((favourite) => {
        console.log("IS FAV", favourite.data);
        setIsFavourite(favourite.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const deleteHandler = () => {
    axios({
      method: "delete",
      url: `/api/Gost/DeleteGost/${params.id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((data) => {
        console.log(data.status);
        if (data.status === 200) {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const favGostHandler = () => {
    const userId = localStorage.getItem("id");
    if (!isFavourite) {
      axios({
        method: "post",
        responseType: "json",
        url: `/api/Gost/AddFavouriteGost/?userId=${userId}&gostId=${params.id}`,
      })
        .then((gost) => {
          console.log("gost.data favourite", gost.data);
          toast.success("Успешно добавлено в избранное!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            progress: undefined,
            pauseOnHover: false,
            draggable: false,
          });
          setIsFavourite(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios({
        method: "delete",
        url: `/api/Gost/DeleteFavouriteGost/?userId=${userId}&gostId=${params.id}`,
      })
        .then((gost) => {
          console.log("gost.data favourite", gost.data);
          toast.success("Успешно удалено из избранного!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            progress: undefined,
            pauseOnHover: false,
            draggable: false,
          });
          setIsFavourite(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const archiveGost = () => {
    axios({
      method: "post",
      url: `/api/Gost/ArchiveGost?gostID=${params.id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((gost) => {
        console.log("gost.data archive", gost.data);
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {localStorage.getItem("role") == "Admin" ? (
        <HeaderAdmin />
      ) : (
        <HeaderUser />
      )}
      <div className="body_container">
        <div className="activities_container">
          <div>
            <a href="/home">Назад</a>
            {isFavourite && (
              <p onClick={() => favGostHandler()}>Удалить из избранного</p>
            )}
            {!isFavourite && (
              <p onClick={() => favGostHandler()}>Добавить в избранное</p>
            )}
          </div>
          {true && (
            <div>
              <a href={`/gostEdit/` + params.id}>Редактировать</a>
              <p onClick={archiveGost}>Архивировать</p>
              <p onClick={deleteHandler}>Удалить</p>
            </div>
          )}
        </div>
        <GostTable view id={params.id} />
      </div>
    </>
  );
};

export default Gost;
