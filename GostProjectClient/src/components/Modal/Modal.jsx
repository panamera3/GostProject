import "./Modal.css";
import { useRef, useEffect } from "react";

const Modal = ({onClose, isOpen, overlay, stylePosition, contentClassName, width, height, children}) => {
  const modalRef = useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className={overlay ? "main_modal_overlay" : ""}>
        <div
          className={`main_modal ${isOpen ? "open" : "closed"}`}
          style={stylePosition}
          ref={modalRef}
        >
          <div
            className={`main_modal_content ${
              contentClassName ? contentClassName : ""
            }`}
            style={{ width: `${width}`, height: `${height}` }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
