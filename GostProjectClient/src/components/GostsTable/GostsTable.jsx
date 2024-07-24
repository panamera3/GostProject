import "./GostsTable.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import { toast } from "react-toastify";
import { fileMinusIcon, likeActiveIcon, likeIcon } from "../../assets/images";

const GostsTable = ({ favourites, archiveGosts, searchGosts }) => {
  const navigate = useNavigate();

  const [gosts, setGosts] = useState([]);
  const [favouritesGosts, setFavouritesGosts] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    pageSize: pageSize,
    offset: 0,
    total: 0,
    currentPage: 1,
  });

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const refreshFavouritesGosts = () => {
    const userId = localStorage.getItem("id");
    axios({
      method: "get",
      url: `/api/Gost/GetFavouritesGosts/${userId}`,
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

  useEffect(() => {
    fetchGosts();
  }, [pagination.pageSize]);

  useEffect(() => {
    fetchGosts();
  }, [sortField, sortDirection]);

  useEffect(() => {
    fetchGosts();
  }, [searchGosts]);

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPagination((prevState) => ({
      ...prevState,
      pageSize: size,
      offset: 0,
      currentPage: 1,
    }));
  };

  const handleSort = (field, asc) => {
    setSortField(field);
    setSortDirection(asc ? "ASC" : "DESC");
    setPagination((prevState) => ({
      ...prevState,
      offset: 0,
      currentPage: 1,
    }));
  };

  const fetchGosts = () => {
    if (favourites) {
      const userId = localStorage.getItem("id");
      axios({
        method: "post",
        url: `/api/Gost/GetFavouritesGosts`,
        data: {
          userId: userId,
          pagination: {
            pageSize: pagination.pageSize,
            offset: pagination.offset,
          },
          sortField: sortField,
          sortDirection: sortDirection,
        },
      })
        .then((gosts) => {
          setGosts(gosts.data.data);
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
      if (!(searchGostsFromHeader.length > 0)) {
        toast.warn("Не было найдено ни одного совпадения");
      }
      setGosts(searchGostsFromHeader);
      setPagination((prevState) => ({
        ...prevState,
        total: searchGostsFromHeader.length,
      }));
    } else {
      if (localStorage.getItem("token")) {
        axios({
          method: "post",
          url: `/api/Gost/GetGosts`,
          data: {
            companyID: localStorage.getItem("workCompanyID"),
            pagination: {
              pageSize: pagination.pageSize,
              offset: pagination.offset,
            },
            sortField: sortField,
            sortDirection: sortDirection,
            archived: archiveGosts,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })
          .then((gosts) => {
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
    axios({
      method: "put",
      responseType: "json",
      url: `/api/Gost/ChangeFavouriteGost/?userId=${userId}&gostId=${gostId}&isFavourite=${state}`,
    })
      .then((gost) => {
        refreshFavouritesGosts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderGostsTable = () => {
    if (gosts) {
      return gosts.map((gost, index) => (
        <tr key={gost.id}>
          <td>
            <p>{index + 1 + pagination.offset}</p>
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
              src={fileMinusIcon}
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
                  src={likeActiveIcon}
                  alt="like"
                  onClick={() => likeHandler(false, gost.id)}
                />
              )}
            {favouritesGosts !== undefined &&
              !favouritesGosts.some((favGost) => favGost.id === gost.id) && (
                <img
                  className="gostsTableButton"
                  src={likeIcon}
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
        companyID: localStorage.getItem("workCompanyID"),
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
      {!favourites && !searchGosts && !archiveGosts && gosts.length == 0 && (
        <div className="no_gosts_container">
          <p>У Вашей организации ещё нет добавленных документов</p>
        </div>
      )}
      {(favourites || searchGosts || archiveGosts) && gosts.length == 0 && (
        <div className="no_gosts_container">
          <p>Нет документов</p>
        </div>
      )}
      {gosts.length > 0 && (
        <div>
          {!(favourites || archiveGosts || searchGosts) && (
            <div className="sortGosts">
              <p>Сортировать по: </p>
              <select
                id="selectSorting"
                onChange={(e) =>
                  handleSort(
                    e.target.value,
                    JSON.parse(
                      e.target.options[e.target.selectedIndex].getAttribute(
                        "asc"
                      )
                    )
                  )
                }
              >
                <option value={`ID`} asc="true">
                  порядковому номеру - возрастание
                </option>
                <option value={`ID`} asc="false">
                  порядковому номеру - убывание
                </option>
                <option value={`OKScode`} asc="true">
                  коду ОКС - возрастание
                </option>
                <option value={`OKScode`} asc="false">
                  коду ОКС - убывание
                </option>
                <option value={`Designation`} asc="true">
                  обозначению - от А до Я
                </option>
                <option value={`Designation`} asc="false">
                  обозначению - от Я до А
                </option>
                <option value={`Denomination`} asc="true">
                  наименованию - от А до Я
                </option>
                <option value={`Denomination`} asc="false">
                  наименованию - от Я до А
                </option>
                <option value={`RequestsNumber`} asc="true">
                  количеству обращений - возрастание
                </option>
                <option value={`RequestsNumber`} asc="false">
                  количеству обращений - убывание
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
          <div className="pageSize">
            <p>Показывать по: </p>
            <select
              id="selectPageSize"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      )}
    </>
  );
};

export default GostsTable;
