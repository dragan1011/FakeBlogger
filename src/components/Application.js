import React, { useState, useEffect } from "react";
import axios from "axios";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleUsernameChange}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button type="submit">Login</button>
    </form>
  );
};

const SearchForm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search posts"
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
      <button type="submit">Search</button>
    </form>
  );
};

const AdminControls = ({
  isAdmin,
  selectedPost,
  onPostCreation,
  onPostUpdate,
  onPostDeletion,
}) => {
  const [formMode, setFormMode] = useState("create");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (selectedPost) {
      setFormMode("update");
      setTitle(selectedPost.title);
      setBody(selectedPost.body);
    } else {
      setFormMode("create");
      setTitle("");
      setBody("");
    }
  }, [selectedPost]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleBodyChange = (event) => {
    setBody(event.target.value);
  };

  const handlePostCreationSubmit = (event) => {
    event.preventDefault();
    onPostCreation({ title, body });
  };

  const handlePostUpdateSubmit = (event) => {
    event.preventDefault();
    onPostUpdate({ ...selectedPost, title, body });
  };

  return (
    <div>
      {
        <form
          onSubmit={
            formMode === "create"
              ? handlePostCreationSubmit
              : handlePostUpdateSubmit
          }
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
          />
          <textarea
            placeholder="Body"
            value={body}
            onChange={handleBodyChange}
          />
          <button type="submit">
            {formMode === "create" ? "Create post" : "Update post"}
          </button>
          {formMode === "update" && (
            <button
              type="button"
              onClick={() => onPostDeletion(selectedPost.id)}
            >
              Delete post
            </button>
          )}
        </form>
      }
    </div>
  );
};

const PostTable = ({ posts, onPostSelection }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post.id}>
            <td>{post.id}</td>
            <td onClick={() => onPostSelection(post)}>{post.title}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Aplikacija = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts").then((response) => {
      setPosts(response.data);
    });
  }, []);

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "admin") {
      setLoggedIn(true);
      setIsAdmin(true);
    } else if (username === "user" && password === "user") {
      setLoggedIn(true);
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setSelectedPost(null);
  };

  const handlePostCreation = (post) => {
    const newPost = { ...post, id: posts.length + 1 };
    setPosts([...posts, newPost]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(
      posts.map((post) => {
        if (post.id === updatedPost.id) {
          return updatedPost;
        }
        return post;
      })
    );
    setSelectedPost(null);
  };

  const handlePostDeletion = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
    setSelectedPost(null);
  };

  const handlePostSelection = (post) => {
    setSelectedPost(post);
  };

  return (
    <div className="App">
      {!loggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
          {selectedPost ? (
            <AdminControls
              isAdmin={isAdmin}
              selectedPost={selectedPost}
              onPostCreation={handlePostCreation}
              onPostUpdate={handlePostUpdate}
              onPostDeletion={handlePostDeletion}
            />
          ) : (
            <SearchForm onSearch={console.log} />
          )}
          <PostTable
            isAdmin={isAdmin}
            posts={posts}
            onPostSelection={handlePostSelection}
          />
        </>
      )}
    </div>
  );
};

export default Aplikacija;
