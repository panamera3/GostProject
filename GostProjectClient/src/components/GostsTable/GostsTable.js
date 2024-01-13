// styles
import "./GostsTable.css";
// images
import file from "../../images/file-minus.svg"
import like from "../../images/like.svg"

// libraries
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { translationDict } from "../constants/translationDict";

const GostsTable = (props) => {
  const navigate = useNavigate();
  const [gosts, setGosts] = useState();

  useEffect(() => {
    axios({
      method: "get",
      url: `https://localhost:7243/api/Gost/GetGosts`,
      //headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((gosts) => {
        console.log(gosts.data);
        setGosts(gosts.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const renderGostsTable = () => {
    if (gosts) {
      return gosts.map((gost) => (
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
            <img
              className="gostsTableButton"
              src={file}
              alt="view"
              onClick={() => {
                navigate(`/gost/${gost.id}`);
                window.location.reload();
              }}
            />
          </td>
          <td>
            <img
              className="gostsTableButton"
              src={like}
              alt="like"
            />
          </td>
        </tr>
      ));
    }
  };

  return (
    <>
      <table className="gostsTable">
        <thead>
          <tr>
            <th scope="col">№</th>
            <th scope="col">Обозначение</th>
            <th scope="col">Код ОКС</th>
            <th scope="col">Наименование</th>
          </tr>
        </thead>
        <tbody>{renderGostsTable()}</tbody>
      </table>
    </>
  );
};

export default GostsTable;
