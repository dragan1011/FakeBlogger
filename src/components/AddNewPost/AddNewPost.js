import { Fragment, useState, useEffect } from "react";
import ReactDOM from "react-dom";

import classes from "./AddNewPost.module.css";

import toast from "react-hot-toast";

const ModalOverlay = ({ closeModal, title, addPost, posts }) => {
  const [naslov, setNaslov] = useState("");
  const [bodyPost, setBodyPost] = useState("");

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

  const notify = () => toast.success("You have successfully added a post.");

  const handleAddPost = (event) => {
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

    const title = naslov;
    const body = bodyPost;
    const newPost = { title, body, id: posts.length + 1 };
    addPost(newPost);
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
          <form onSubmit={handleAddPost} className={classes.modalWrapper}>
            <div className={classes.smallWrapper}>
              <label name="id" />
              <label className={classes.label}>Title</label>
              <input
                name="title"
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
                spellCheck={false}
                onChange={(e) => setBodyPost(e.target.value)}
                className={`${classes.textarea} `}
                type="text"
              />
            </div>
            <footer className={classes.actions}>
              <button type="submit" className={classes.button}>
                Add
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
          closeModal={props.closeModal}
          title={props.title}
          addPost={props.addPost}
          posts={props.posts}
        >
          {props.children}
        </ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default Modal;
