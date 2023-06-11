import { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchPost } from "./redux/slices/counterSlices";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPost());
  }, []);

  const post = useSelector((state) => state.post);
  const { postsList, loading } = post;
  console.log(post);
  return (
    <div className="App">
      <h1>Post List</h1>
      <hr />
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        postsList?.map((post) => (
          <>
            <h2>{post?.title}</h2>
          </>
        ))
      )}
    </div>
  );
}

export default App;
