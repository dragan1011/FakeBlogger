import { Fragment, useState, useEffect } from "react";
import ReactDOM from "react-dom";

import classes from "./Preview.module.css";

const ModalOverlay = ({ closeModal, data, title }) => {
  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
  }, []);

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      close();
    }
  };

  const close = () => {
    closeModal(false);
    document.body.style.overflow = "visible";
  };

  return (
    <div>
      <div
        onClick={() => {
          closeModal(false);
          document.body.style.overflow = "scroll";
        }}
        className={classes.backdrop}
      />
      <div className={`${classes.modal} ${classes.card}`}>
        <header className={classes.header}>
          <h2>{title}</h2>
        </header>
        <div className={classes.content}>
          <form className={classes.modalWrapper}>
            <div className={classes.smallWrapper}>
              <label name="id" value={data.id} />
              <label className={classes.label}>Title:</label>
              <div className={classes.textContent}>
                {data.title.slice(0, 1).toUpperCase() +
                  data.title.slice(1, 500).toLocaleLowerCase()}
              </div>
            </div>
            <div className={classes.smallWrapper}>
              <label className={classes.label}>Body:</label>
              <div className={classes.textContent}>
                {data.body.slice(0, 1).toUpperCase() +
                  data.body.slice(1, 500).toLocaleLowerCase()}
              </div>
            </div>
            <footer className={classes.actions}>
              <button
                onClick={() => {
                  closeModal(false);
                  document.body.style.overflow = "scroll";
                }}
                className={classes.close}
              >
                Cancel
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const Modal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <ModalOverlay
          data={props.data}
          closeModal={props.closeModal}
          title={props.title}
        >
          {props.children}
        </ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default Modal;
