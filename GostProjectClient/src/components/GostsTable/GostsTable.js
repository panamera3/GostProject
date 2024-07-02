import "./GostsTable.css";
import file from "../../images/file-minus.svg";
import like from "../../images/like.svg";
import likeActive from "../../images/like_active.svg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { translationGostDict } from "../constants/translationGostDict";
import Pagination from "react-js-pagination";

const GostsTable = ({ favourites, archiveGosts, searchGosts }) => {
  const navigate = useNavigate();

  const [gosts, setGosts] = useState([]);
  const [favouritesGosts, setFavouritesGosts] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    offset: 0,
    total: 0,
    currentPage: 1,
  });

  const refreshFavouritesGosts = () => {
    const userId = localStorage.getItem("id");
    axios({
      method: "get",
      url: `/api/Gost/GetFavouritesGosts/${userId}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((favGosts) => {
        setFavouritesGosts(favGosts.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchGosts();
    refreshFavouritesGosts();
  }, [pagination.offset]);

  const fetchGosts = () => {
    if (favourites) {
      const userId = localStorage.getItem("id");
      axios({
        method: "get",
        url: `/api/Gost/GetFavouritesGosts/${userId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((gosts) => {
          setGosts(gosts.data);
          setPagination((prevState) => ({
            ...prevState,
            total: gosts.data.pagination.total,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (searchGosts) {
      const searchGostsFromHeader = JSON.parse(
        localStorage.getItem("searchGosts")
      );
      setGosts(searchGostsFromHeader);
      setPagination((prevState) => ({
        ...prevState,
        total: 10, // searchGostsFromHeader.length,
      }));
    } else {
      if (localStorage.getItem("token")) {
        axios({
          method: "post",
          url: `/api/Gost/GetGosts`,
          data: {
            userID: localStorage.getItem("id"),
            pagination: {
              pageSize: pagination.pageSize,
              offset: pagination.offset,
            },
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })
          .then((gosts) => {
            console.log("gosts", gosts);
            setGosts(gosts.data.data);
            setPagination((prevState) => ({
              ...prevState,
              total: gosts.data.pagination.total,
            }));
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  const handlePageChange = (page) => {
    setPagination((prevState) => ({
      ...prevState,
      offset: (page - 1) * prevState.pageSize,
      currentPage: page,
    }));
  };

  const likeHandler = (state, gostId) => {
    const userId = localStorage.getItem("id");
    if (state) {
      axios({
        method: "post",
        responseType: "json",
        url: `/api/Gost/AddFavouriteGost/?userId=${userId}&gostId=${gostId}`,
      })
        .then((gost) => {
          refreshFavouritesGosts();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios({
        method: "delete",
        url: `/api/Gost/DeleteFavouriteGost/?userId=${userId}&gostId=${gostId}`,
      })
        .then((gost) => {
          refreshFavouritesGosts();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const renderGostsTable = () => {
    if (gosts) {
      var renderGosts = gosts;
      if (!searchGosts) {
        renderGosts = renderGosts.filter(
          (gost) =>
            (archiveGosts && gost.isArchived) ||
            (!archiveGosts && !gost.isArchived)
        );
      }
      return renderGosts.map((gost) => (
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

  const sortGosts = (selectedSort, selectedAsc) => {
    axios({
      method: "post",
      url: `/api/Gost/GetGosts`,
      data: {
        userID: localStorage.getItem("id"),
        pagination,
        sortField: selectedSort,
        sortDirection: selectedAsc ? "ASC" : "DESC",
      },
      headers: {
        "Content-Type": "application/json",
        //'Authorization': Bearer ${localStorage.getItem("token")}
      },
    })
      .then((gosts) => {
        setGosts(gosts.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {!(favourites || archiveGosts || searchGosts) && (
        <div className="sortGosts">
          <p>Сортировать по: </p>
          <select
            id="selectSorting"
            onChange={(e) =>
              sortGosts(
                e.target.value,
                JSON.parse(
                  e.target.options[e.target.selectedIndex].getAttribute("asc")
                )
              )
            }
          >
            <option value={`ID`} asc="true">
              Порядковому номеру - возрастание
            </option>
            <option value={`ID`} asc="false">
              Порядковому номеру - убывание
            </option>
            <option value={`OKScode`} asc="true">
              Коду ОКС - возрастание
            </option>
            <option value={`OKScode`} asc="false">
              Коду ОКС - убывание
            </option>
            <option value={`Designation`} asc="true">
              Обозначению - возрастание
            </option>
            <option value={`Designation`} asc="false">
              Обозначению - убывание
            </option>
            <option value={`Denomination`} asc="true">
              Наименованию - возрастание
            </option>
            <option value={`Denomination`} asc="false">
              Наименованию - убывание
            </option>
            <option value={`RequestsNumber`} asc="true">
              Количеству обращений - возрастание
            </option>
            <option value={`RequestsNumber`} asc="false">
              Количеству обращений - убывание
            </option>
          </select>
        </div>
      )}

      <table className="gostsTable">
        <thead>
          <tr>
            <th scope="col">№</th>
            <th scope="col">Обозначение</th>
            <th scope="col">Код ОКС</th>
            <th scope="col">Наименование</th>
            <th scope="col">Количество обращений</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>{renderGostsTable()}</tbody>
      </table>

      <Pagination
  className="pagination-bar"
  activePage={pagination.currentPage}
  totalItemsCount={pagination.total}
  itemsCountPerPage={pagination.pageSize}
  onChange={handlePageChange}
/>
    </>
  );
};

export default GostsTable;
