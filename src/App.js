import React, { useState, useEffect } from "react";
import axios from "axios";
import classes from "./App.module.css";
import { Button } from "bootstrap";
const App = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState("logout");
  const [showEdit, setShowEdit] = useState(false)

  const loadPosts = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    setPosts(response.data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const editField = () =>{
    setShowEdit(prevState => !prevState)
  }

  const addPost = (post) => {
    setPosts([, post, ...posts]);
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

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
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

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPost = (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const body = event.target.body.value;
    const newPost = { title, body, id: posts.length + 1 };
    addPost(newPost);
    event.target.reset();
  };

  const handleUpdatePost = (event) => {
    event.preventDefault();
    const id = event.target.id.value;
    const title = event.target.title.value;
    const body = event.target.body.value;
    const updatedPost = { title, body, id: Number(id) };
    updatePost(Number(id), updatedPost);
    event.target.reset();
  };

  const handleDeletePost = (id) => {
    deletePost(id);
  };

  return (
    <div>
      {currentUser === "logout" && (
        <form className={classes.login} onSubmit={handleLogin}>
          <label className={classes.title}>Welcome</label>
          <label className={classes.label}>
            Username:
            <input autoComplete="off" className={classes.input} type="text" name="username" required />
          </label>
          <label className={classes.label}>
            Password:
            <input autoComplete="off" className={classes.input} type="password" name="password" required />
          </label>
          <button type="submit" className={classes.button} >Login</button>
        </form>
      )}
      {(currentUser === "admin" || currentUser === "user") && (
        <div className={classes.Position}>
          <button className={`${classes.close} ${classes.logoutButton}`} onClick={handleLogout}>Logout</button>
          {currentUser === "admin" && (
            
            <form className={classes.addPost} onSubmit={handleAddPost}>
               <h2 className={classes.titlePost}>Add a new post</h2>
              <label className={classes.label}>
                Title:
                <input className={classes.input} type="text" name="title" required />
              </label>
              <label className={classes.label}>
                Body:
                <input className={classes.input}  name="body" required />
              </label>
              <button className={classes.button} type="submit">Add post</button>
            </form>
          )}
          <table>
            <thead>
              <tr>
                <th>Title</th>
                { currentUser === "admin" &&<th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  {currentUser === "admin" && (
                    <td>
                      <button className={classes.close} onClick={() => handleDeletePost(post.id)}>
                        Delete
                      </button>
                      
                        <button className={classes.button}  onClick={editField}>Edit</button>
                        { showEdit && <form onSubmit={handleUpdatePost}>
                          <input type="hidden" name="id" value={post.id} />
                          <label>
                            Title:
                            <input
                              type="text"
                              name="title"
                              defaultValue={post.title}
                              required
                            />
                          </label>
                          <label>
                            Body:
                            <textarea
                              name="body"
                              defaultValue={post.body}
                              required
                            />
                          </label>
                          <button type="submit">Update post</button>
                        </form>
                    }
                    </td>
                  )}
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
