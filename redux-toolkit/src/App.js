import logo from "./logo.svg";
import "./App.css";

import {
  decrement,
  increaseAmount,
  increment,
} from "./redux/slices/counterSlices";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const counter = useSelector((state) => state?.counter);
  console.log(counter);
  return (
    <div className="App">
      <h1>Redux Toolkit</h1>
      <h2>Counter: {counter?.value}</h2>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(increaseAmount(20))}>Increase Amount</button>
    </div>
  );
}

export default App;
