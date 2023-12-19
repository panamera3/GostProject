//styles
import "./LeftColumnLogReg.css";
// libraries
import { useNavigate } from "react-router-dom";

const LeftColumnLogReg = ({ children }, props) => {
  const navigate = useNavigate();

  const redirectHandler = () => {
    navigate("/login");
  };

  return (
    <>
      <div id="columns_flex">
        <div id="left_column_log_reg">
          {!props.login && (
            <>
              <h2>Регистрация</h2>
              <p>
                Впервые на платформе? Необходимо зарегистрироваться по кнопке
                ниже
              </p>
              <button type="button" onClick={redirectHandler}>
                Зарегистрироваться
              </button>
            </>
          )}
        </div>
        {children}
      </div>
    </>
  );
};

export default LeftColumnLogReg;
