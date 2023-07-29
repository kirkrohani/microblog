import PostCreate from "./PostCreate";
import PostList from "./PostList";
import React from "react";

const App = () => {
  return (
    <div className="container">
      <h1>Create a Blog Post</h1>
      <PostCreate />
      <hr />
      <h1>Posts</h1>
      <PostList />
    </div>
  );
};
export default App;
