import { Fragment, useState, useEffect } from "react";
import ReactDOM from "react-dom";

import classes from "./ConfirmDelete.module.css";
import toast from "react-hot-toast";

const ModalOverlay = ({ closeModal, title, data, deletePost }) => {
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
  const notify = () => toast.success("You have successfully deleted the post.");

  const handleDeletePost = (id) => {
    deletePost(id);
    close();
    notify();
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
              <label className={classes.label} name="id">
                Are you sure you want to delete the post?
              </label>
            </div>
            <footer className={classes.actions}>
              <button
                type="button"
                className={classes.button}
                onClick={() => {
                  handleDeletePost(data.id);
                }}
              >
                Delete
              </button>
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
          deletePost={props.deletePost}
        >
          {props.children}
        </ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default Modal;
