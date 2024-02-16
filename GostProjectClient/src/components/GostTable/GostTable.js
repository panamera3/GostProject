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
      axios({
        method: "get",
        url: `https://localhost:7243/api/Gost/GetGost/${props.id}`,
        //headers: { Authorization: `Bearer ${userToken}` },
      })
        .then((gost) => {
          console.log("just gosts", gost.data);
          setGost(gost.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const renderGostTable = () => {
    if (gost) {
      console.log("TEST FOR NOW", gost);
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
      if (props.add) {
        const addFields = [
          "designation",
          "denomination",
          "oksCode",
          "okpdCode",
          "developerId",
          "content",
          "keywords",
          "keyphrases",
          "acceptanceLevel",
          "text",
          "normativeReferences",
        ];

        return addFields.map((key, index) => (
          <tr key={index}>
            <td>
              <label htmlFor={key}>{translationDict[key]}</label>
            </td>
            <td>
              <input
                className="gostInputAdd"
                value={formData[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
              />
            </td>
          </tr>
        ));
      }
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
    event.preventDefault();
    console.log(formData);
    console.log("ok");
    const formAddData = new FormData();
    formAddData.append("gostAddDto", JSON.stringify(formData));
    for (const key in formData) {
      formAddData.append(key, formData[key]);
    }

    console.log("formAddData", formAddData);
    console.log("TEST", formData.id);
    if (props.add) {
      axios({
        method: "post",
        url: `https://localhost:7243/api/Gost/AddGost`,
        data: {
          designation: formData.designation,
          denomination: formData.denomination,
          oksCode: formData.oksCode,
          okpdCode: formData.okpdCode,
          developerId: localStorage.getItem("id"),
          content: formData.content,
          keywords: formData.keywords.split(","),
          keyphrases: formData.keyphrases.split(","),
          acceptanceLevel: Number(formData.acceptanceLevel),
          text: formData.text,
          normativeReferences: formData.normativeReferences,
        },
        headers: {
          "Content-Type": "application/json",
          //'Authorization': Bearer ${userToken}
        },
      })
        .then((gost) => {
          console.log(gost.data);
          setGost(gost.data);
          navigate("/home");
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
        {!props.view && props.edit && (
          <>
            <button className="btn_blue" type="submit">
              Сохранить
            </button>
            <button
              className="btn_darkGray"
              type="button"
              onClick={openModalCard}
            >
              Отменить
            </button>
          </>
        )}
        {!props.view && props.add && (
          <>
            <button className="btn_blue" type="submit">
              Добавить
            </button>
            <button
              className="btn_darkGray"
              type="button"
              onClick={openModalCard}
            >
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
            <button className="btn_blue" onClick={cancelHandler}>
              Покинуть
            </button>
            <button className="btn_gray" onClick={closeModalCard}>
              Вернуться
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default GostTable;
