import "./Modal.css";
import { useRef, useEffect } from "react";

const Modal = (props) => {
  const modalRef = useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      props.onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!props.isOpen) return null;

  return (
    <>
      <div className={props.overlay ? "main_modal_overlay" : ""}>
        <div
          className={`main_modal ${props.isOpen ? "open" : "closed"}`}
          style={props.stylePosition}
          ref={modalRef}
        >
          <div
            className={`main_modal_content ${
              props.contentClassName ? props.contentClassName : ""
            }`}
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
