// styles
import "./Modal.css";

const Modal = (props) => {
  if (!props.isOpen) return null;

  return (
    <>
      <div className={props.overlay ? "main_modal_overlay" : ""}>
        <div className="main_modal" style={props.stylePosition}>
          <div
            className="main_modal_content"
            style={{ width: `${props.width}`, height: `${props.height}` }}
          >
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
