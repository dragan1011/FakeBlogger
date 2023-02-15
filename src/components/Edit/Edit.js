import { Fragment, useState, useEffect } from "react";
import ReactDOM from "react-dom";

import classes from "./Edit.module.css";
import toast from "react-hot-toast";
const ModalOverlay = ({ closeModal, data, title, updatePost }) => {
  const [naslov, setNaslov] = useState(data.title);
  const [bodyPost, setBodyPost] = useState(data.body);

  const notify = () =>
    toast.success("You have successfully modified the post.");

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

  const handleUpdatePost = (event) => {
    event.preventDefault();

    if (
      naslov.trim() == "" ||
      naslov.trim() == null ||
      naslov.trim().length == 0
    ) {
      return toast.error("Title can't be empty.");
    }
    if (
      bodyPost.trim() == "" ||
      bodyPost.trim() == null ||
      bodyPost.trim().length == 0
    ) {
      return toast.error("Body can't be empty.");
    }

    const id = data.id;
    const title = naslov;
    const body = bodyPost;
    const updatedPost = { title, body, id: Number(id) };
    updatePost(Number(id), updatedPost);
    event.target.reset();
    close();
    notify();
  };

  return (
    <div>
      <div
        onClick={() => {
          closeModal(false);
          document.body.style.overflow = "visible";
        }}
        className={classes.backdrop}
      />
      <div className={`${classes.modal} ${classes.card}`}>
        <header className={classes.header}>
          <h2>{title}</h2>
        </header>
        <div className={classes.content}>
          <form onSubmit={handleUpdatePost} className={classes.modalWrapper}>
            <div className={classes.smallWrapper}>
              <label name="id" value={data.id} />
              <label className={classes.label}>Title</label>
              <input
                name="title"
                defaultValue={
                  data.title.slice(0, 1).toUpperCase() +
                  data.title.slice(1, 500).toLocaleLowerCase()
                }
                spellCheck={false}
                onChange={(e) => {
                  setNaslov(e.target.value);
                }}
                className={`${classes.input}`}
                type="text"
              />
            </div>
            <div className={classes.smallWrapper}>
              <label className={classes.label}>Body</label>
              <textarea
                name="body"
                defaultValue={
                  data.body.slice(0, 1).toUpperCase() +
                  data.body.slice(1, 500).toLocaleLowerCase()
                }
                spellCheck={false}
                onChange={(e) => setBodyPost(e.target.value)}
                className={`${classes.textarea} `}
                type="text"
              />
            </div>
            <footer className={classes.actions}>
              <button type="submit" className={classes.button}>
                Update
              </button>
              <button
                onClick={() => {
                  closeModal(false);
                  document.body.style.overflow = "visible";
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
          updatePost={props.updatePost}
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
