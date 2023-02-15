import React, { useState, useEffect } from "react";
import axios from "axios";
import classes from "./App.module.css";
import Edit from "./components/Edit/Edit";
import Preview from "./components/Preview/Preview";
import ConfirmDelete from "./components/ConfirmDelete/ConfirmDelete";
import AddNewPost from "./components/AddNewPost/AddNewPost";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState("logout");
  const [showEdit, setShowEdit] = useState(false);
  const [clickedPost, setClickedPost] = useState("");
  const [preview, setPreview] = useState(false);
  const [izbrisiPost, setIzbrisiPost] = useState(false);
  const [dodajPost, setDodajPost] = useState(false);

  const loadPosts = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    setPosts(response.data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const modal = () => {
    setShowEdit(true);
    document.body.style.overflow = "hidden";
  };

  const modalPreview = () => {
    setPreview(true);
    document.body.style.overflow = "hidden";
  };

  const deletePostModal = () => {
    setIzbrisiPost(true);
    document.body.style.overflow = "hidden";
  };

  const addPostModal = () => {
    setDodajPost(true);
    document.body.style.overflow = "hidden";
  };

  const addPost = (post) => {
    setPosts([...posts, post]);
  };

  const updatePost = (id, updatedPost) => {
    const updatedPosts = posts.map((post) =>
      post.id === id ? updatedPost : post
    );
    setPosts(updatedPosts);
  };

  const deletePost = (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    if (username === "admin" && password === "admin") {
      setCurrentUser("admin");
    } else if (username === "user" && password === "user") {
      setCurrentUser("user");
    }
    event.target.reset();
  };

  const handleLogout = () => {
    setCurrentUser("logout");
  };

  return (
    <div>
      {currentUser === "logout" && (
        <form className={classes.login} onSubmit={handleLogin}>
          <label className={classes.title}>Welcome</label>
          <label className={classes.label}>
            Username:
            <input
              autoComplete="off"
              className={classes.input}
              type="text"
              name="username"
            />
          </label>
          <label className={classes.label}>
            Password:
            <input
              autoComplete="off"
              className={classes.input}
              type="password"
              name="password"
            />
          </label>
          <button type="submit" className={classes.button}>
            Login
          </button>
        </form>
      )}
      {(currentUser === "admin" || currentUser === "user") && (
        <div className={classes.Position}>
          <Toaster position="top-right" reverseOrder={false} />
          {showEdit && (
            <Edit
              updatePost={updatePost}
              title="Edit post"
              data={clickedPost}
              closeModal={setShowEdit}
            />
          )}
          {preview && (
            <Preview
              title="Post preview"
              data={clickedPost}
              closeModal={setPreview}
            />
          )}
          {izbrisiPost && (
            <ConfirmDelete
              deletePost={deletePost}
              data={clickedPost}
              closeModal={setIzbrisiPost}
              title="Confirmation"
            />
          )}
          {dodajPost && (
            <AddNewPost
              addPost={addPost}
              posts={posts}
              closeModal={setDodajPost}
              title="Add a new post"
            />
          )}
          <div className={classes.logedRole}>
            You are logged in as {currentUser}
          </div>
          <button
            className={`${classes.close} ${classes.logoutButton}`}
            onClick={handleLogout}
          >
            Logout
          </button>
          {currentUser === "admin" && (
            <button
              className={`${classes.button} ${classes.logoutButton}`}
              onClick={addPostModal}
            >
              Add post
            </button>
          )}
          <table className={classes.table}>
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className={classes.input}
            />
            <tbody className={classes.post}>
              {posts
                .filter((item) => {
                  return searchTerm.toLocaleLowerCase() === ""
                    ? item
                    : item.title.toLocaleLowerCase().includes(searchTerm);
                })
                .map((post) => (
                  <tr
                    className={classes.postOne}
                    key={post?.id}
                    onClick={() => {
                      setClickedPost(post);
                    }}
                  >
                    <td className={classes.postTitle}>
                      {post.title.slice(0, 1).toUpperCase() +
                        post.title.slice(1, 500).toLocaleLowerCase()}
                    </td>

                    <td>
                      {currentUser === "admin" && (
                        <div>
                          {" "}
                          <button
                            className={`${classes.close} ${classes.delete}`}
                            onClick={() => deletePostModal()}
                          >
                            Delete
                          </button>
                          <button className={classes.button} onClick={modal}>
                            Edit
                          </button>
                        </div>
                      )}
                      {currentUser === "user" && (
                        <button
                          className={classes.button}
                          onClick={modalPreview}
                        >
                          Preview
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default App;
