// styles
import "./GostsTable.css";
// images
import file from "../../images/file-minus.svg";
import like from "../../images/like.svg";
import likeActive from "../../images/like_active.svg";
// libraries
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { translationDict } from "../constants/translationDict";

const GostsTable = (props) => {
  const navigate = useNavigate();

  const [gosts, setGosts] = useState();
  const [favouritesGosts, setFavouritesGosts] = useState();

  const refreshFavouritesGosts = () => {
    const userId = localStorage.getItem("id");
    axios({
      method: "get",
      url: `https://localhost:7243/api/Gost/GetFavouritesGosts/${userId}`,
      //headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((favGosts) => {
        setFavouritesGosts(favGosts.data);
        console.log("setFavouritesGosts", favGosts.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(props.searchGosts);
    if (props.favourites) {
      console.log("ПЕРВОЕ");
      console.log("props.favourites");
      const userId = localStorage.getItem("id");
      axios({
        method: "get",
        url: `https://localhost:7243/api/Gost/GetFavouritesGosts/${userId}`,
        //headers: { Authorization: `Bearer ${userToken}` },
      })
        .then((gosts) => {
          console.log(gosts.data);
          setGosts(gosts.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (props.searchGosts) {
      console.log("ВТОРОЕ");
      const searchGostsFromHeader = JSON.parse(
        localStorage.getItem("searchGosts")
      );
      console.log("searchGostsFromHeader", searchGostsFromHeader);
      setGosts(searchGostsFromHeader);
    } else {
      console.log("ТРЕТЬЕ");
      axios({
        method: "get",
        url: `https://localhost:7243/api/Gost/GetGosts`,
        //headers: { Authorization: `Bearer ${userToken}` },
      })
        .then((gosts) => {
          setGosts(gosts.data);
          console.log("setGosts", gosts.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    refreshFavouritesGosts();
  }, []);

  const likeHandler = (state, gostId) => {
    const userId = localStorage.getItem("id");
    if (state) {
      axios({
        method: "post",
        responseType: "json",
        url: `https://localhost:7243/api/Gost/AddFavouriteGost/?userId=${userId}&gostId=${gostId}`,
      })
        .then((gost) => {
          console.log("gost.data favourite", gost.data);
          refreshFavouritesGosts();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios({
        method: "delete",
        url: `https://localhost:7243/api/Gost/DeleteFavouriteGost/?userId=${userId}&gostId=${gostId}`,
      })
        .then((gost) => {
          console.log("gost.data favourite", gost.data);
          refreshFavouritesGosts();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const renderGostsTable = () => {
    if (gosts) {
      return gosts
        .filter(
          (gost) =>
            (props.archiveGosts && gost.isArchived) ||
            (!props.archiveGosts && !gost.isArchived)
        )
        .map((gost) => (
          <tr key={gost.id}>
            <td>
              <p>{gost.id}</p>
            </td>
            <td>
              <p>{gost.designation}</p>
            </td>
            <td>
              <p>{gost.oksCode}</p>
            </td>
            <td>
              <p>{gost.denomination}</p>
            </td>
            <td>
              <p>{gost.requestsNumber}</p>
            </td>
            <td>
              <img
                className="gostsTableButton"
                src={file}
                alt="view"
                onClick={() => {
                  navigate(`/gost/${gost.id}`);
                }}
              />
            </td>
            <td>
              {favouritesGosts !== undefined &&
                favouritesGosts.some((favGost) => favGost.id === gost.id) && (
                  <img
                    className="gostsTableButton"
                    src={likeActive}
                    alt="like"
                    onClick={() => likeHandler(false, gost.id)}
                  />
                )}
              {favouritesGosts !== undefined &&
                !favouritesGosts.some((favGost) => favGost.id === gost.id) && (
                  <img
                    className="gostsTableButton"
                    src={like}
                    alt="like"
                    onClick={() => likeHandler(true, gost.id)}
                  />
                )}
            </td>
          </tr>
        ));
    }
  };

  const [pagination, setPagination] = useState({
    pageSize: 10,
    offset: 0,
    total: 10,
  });
  const sortField = "Designation";
  const exampleOfWork = () => {
    axios({
      method: "post",
      url: `https://localhost:7243/api/Gost/GetGosts`,
      data: { userID: localStorage.getItem("id"), pagination, sortField },
      headers: {
        "Content-Type": "application/json",
        //'Authorization': Bearer ${userToken}
      },
    })
      .then((gosts) => {
        console.log("gosts.data", gosts.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <button onClick={() => exampleOfWork()}>test</button>
      <table className="gostsTable">
        <thead>
          <tr>
            <th scope="col">№</th>
            <th scope="col">Обозначение</th>
            <th scope="col">Код ОКС</th>
            <th scope="col">Наименование</th>
            <th scope="col">Количество обращений</th>
          </tr>
        </thead>
        <tbody>{renderGostsTable()}</tbody>
      </table>
    </>
  );
};

export default GostsTable;
