/* import "./App.css";

function App() {
  return <div className="App"></div>;
}

export default App;
 */

/* import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import PostList from "./pages/PostList/PostList";
import PostForm from "./pages/PostForm/PostForm";
import { useSelector } from "react-redux";

const App = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const posts = useSelector((state) => state.posts);

  const handleAdd = () => {
    setSelectedPost(null);
    setShowAddForm(true);
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setShowEditForm(true);
  };

  const handleClose = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <h1>Blog</h1>
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <Button variant="primary" onClick={handleAdd}>
            Add post
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <PostList posts={posts} handleEdit={handleEdit} />
        </Col>
      </Row>

      {showAddForm && <PostForm handleClose={handleClose} />}
      {showEditForm && (
        <PostForm post={selectedPost} handleClose={handleClose} />
      )}
    </Container>
  );
};

export default App;
 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState("logout");

  const loadPosts = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    setPosts(response.data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

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
    <div className="App">
      {currentUser === "logout" && (
        <form onSubmit={handleLogin}>
          <label>
            Username:
            <input type="text" name="username" required />
          </label>
          <label>
            Password:
            <input type="password" name="password" required />
          </label>
          <button type="submit">Login</button>
        </form>
      )}
      {(currentUser === "admin" || currentUser === "user") && (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <h2>Add a new post</h2>
          {currentUser === "admin" && (
            <form onSubmit={handleAddPost}>
              <label>
                Title:
                <input type="text" name="title" required />
              </label>
              <label>
                Body:
                <textarea name="body" required />
              </label>
              <button type="submit">Add post</button>
            </form>
          )}
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  {currentUser === "admin" && (
                    <td>
                      <button onClick={() => handleDeletePost(post.id)}>
                        Delete
                      </button>
                      <details>
                        <summary>Edit</summary>
                        <form onSubmit={handleUpdatePost}>
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
                      </details>
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
