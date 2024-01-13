// styles
import "./GostTable.css";
// images

// libraries
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Modal/Modal";
import { translationDict } from "../constants/translationDict";

const GostTable = (props) => {
  const navigate = useNavigate();
  const [gost, setGost] = useState();
  const [formData, setFormData] = useState({});

  const [isModalOpen, setModalOpen] = useState(false);
  const openModalCard = () => {
    setModalOpen(true);
    console.log(1213);
  };
  const closeModalCard = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (props.view || props.edit) {
      if (localStorage.getItem("count") == 3) {
        axios({
          method: "get",
          url: `https://localhost:7243/api/Gost/GetGost/3`,
          //headers: { Authorization: `Bearer ${userToken}` },
        })
          .then((gost) => {
            console.log(gost.data);
            setGost(gost.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios({
          method: "get",
          url: `https://localhost:7243/api/Gost/GetGost/3`,
          //headers: { Authorization: `Bearer ${userToken}` },
        })
          .then((gost) => {
            console.log(gost.data);
            setGost(gost.data);
            localStorage.setItem("count", 3);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, []);

  const renderGostTable = () => {
    if (gost) {
      return Object.keys(gost).map((key) => (
        <tr key={key}>
          <td>
            <label htmlFor={key}>{translationDict[key] || key}</label>
          </td>
          <td>
            {props.view && <p>{gost[key]}</p>}
            {props.edit && (
              <input
                className="gostInput"
                placeholder={translationDict[key] || key}
                value={gost[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
              />
            )}
          </td>
          <td>Дата</td>
        </tr>
      ));
    } else {
      return Object.keys(translationDict).map((key) => (
        <tr key={key}>
          <td>
            <label htmlFor={key}>{translationDict[key]}</label>
          </td>
          <td>
            <input
              className="gostInput"
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
          </td>
        </tr>
      ));
    }
  };

  const submitHandler = (event) => {
    console.log(formData);
    console.log("ok");
    event.preventDefault();
    const formAddData = new FormData();
    formAddData.append('gostAddDto', JSON.stringify(formData));
    for (const key in formData) {
      formAddData.append(key, formData[key]);
    }

    console.log(formAddData);
    if (props.add) {
      axios({
        method: "post",
        url: `https://localhost:7243/api/Gost/AddGost`,
        data: formAddData,
        headers: {
          "Content-Type": "application/json",
          //'Authorization': Bearer ${userToken}
        },
      })
        .then((gost) => {
          console.log(gost.data);
          setGost(gost.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    /*
    if(props.edit){
      axios({
        method: "post",
        url: `https://localhost:7243/api/Gost/GetGost/3`,
        //headers: { Authorization: `Bearer ${userToken}` },
      })
        .then((gost) => {
          console.log(gost.data);
          setGost(gost.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    */
  };

  const cancelHandler = () => {
    navigate("/home");
    window.location.reload();
  };

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <table className="gost_table">
          <thead>
            <tr>
              <th scope="col">Поле</th>
              <th scope="col">Первоначальное значение</th>
              {!props.add && <th scope="col">Дата последней актуализации</th>}
            </tr>
          </thead>
          <tbody>{renderGostTable()}</tbody>
        </table>
        {!props.view && (
          <>
            <button type="submit">Сохранить</button>
            <button type="button" onClick={openModalCard}>
              Отменить
            </button>
          </>
        )}
      </form>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModalCard}
          contentClassName="cancel"
          overlay
        >
          <div>
            <p>Внесенные изменения не будут сохранены.</p>
            <p>Вы точно хотите покинуть раздел редактирования документа?</p>
          </div>
          <div className="modalCancel_buttons">
            <button onClick={cancelHandler}>Покинуть</button>
            <button onClick={closeModalCard}>Вернуться</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default GostTable;
