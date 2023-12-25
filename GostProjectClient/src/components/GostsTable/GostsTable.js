// styles

// images

// libraries
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const GostsTable = (props) => {
  const navigate = useNavigate();

  return (
    <>
      <table>
        <thead>
          <tr>
            <th scope="col">№</th>
            <th scope="col">Обозначение</th>
            <th scope="col">Код ОКС</th>
            <th scope="col">Наименование</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>
              <img
                src=""
                alt="btn"
                onClick={() => {
                  navigate("/gostAdd");
                }}
              />
            </td>
            <td>4</td>
          </tr>
          <tr>
            <td>5</td>
            <td>6</td>
            <td>7</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default GostsTable;
