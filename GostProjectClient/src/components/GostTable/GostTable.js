// styles

// images

// libraries
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "../Modal/Modal";

const GostTable = (props) => {
  return (
    <>
      <table>
      <thead>
          <tr>
            <th scope="col">Поле</th>
            <th scope="col">Первоначальное значение</th>
            <th scope="col">Дата последней актуализации</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
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

export default GostTable;
