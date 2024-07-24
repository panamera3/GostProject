import "./Gost.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GostTable from "../../components/GostTable/GostTable";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import HeaderUser from "../../components/Header/HeaderUser";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BodyContainer } from "../../components/styles/styled_components";
import BackLink from "../../components/BackLink/BackLink";

const Gost = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isFavourite, setIsFavourite] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    axios({
      method: "post",
      url: `/api/Gost/AddRequest?gostID=${params.id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((gost) => {})
      .catch((error) => {
        console.log(error);
      });

    axios({
      method: "get",
      url: `/api/Gost/CheckFavouriteAndArchiveGost/${localStorage.getItem(
        "id"
      )}/${params.id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        setIsFavourite(response.data.isFavourite);
        setIsArchived(response.data.isArchived);
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
        if (data.status === 200) {
          toast.success("ГОСТ был успешно удалён");
          navigate("/home");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const favGostHandler = () => {
    const userId = localStorage.getItem("id");
    axios({
      method: "put",
      responseType: "json",
      url: `/api/Gost/ChangeFavouriteGost/?userId=${userId}&gostId=${
        params.id
      }&isFavourite=${!isFavourite}`,
    })
      .then((gost) => {
        toast.success(
          !isFavourite
            ? "Успешно добавлено в избранное!"
            : "Успешно удалено из избранного!"
        );
        setIsFavourite(!isFavourite);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const archiveGostHandler = () => {
    axios({
      method: "put",
      url: `/api/Gost/ChangeArchiveGost?gostID=${
        params.id
      }&isArchived=${!isArchived}`,
    })
      .then((gost) => {
        toast.success(
          !isArchived
            ? "ГОСТ был успешно архивирован"
            : "ГОСТ был успешно разархивирован"
        );
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
      <BodyContainer>
        <div className="activities_container">
          <div>
            <BackLink/>
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
              {isArchived && (
                <p onClick={() => archiveGostHandler()}>Разархивировать</p>
              )}
              {!isArchived && (
                <p onClick={() => archiveGostHandler()}>Архивировать</p>
              )}
              <p onClick={deleteHandler}>Удалить</p>
            </div>
          )}
        </div>
        <GostTable view id={params.id} />
      </BodyContainer>
    </>
  );
};

export default Gost;
