import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom";

export const AdminRoute = ({ component: Component, ...rest }) => {
  //check if user is login
  const user = useSelector((state) => state?.users);
  const { userAuth } = user;
  return (
    <Route
      {...rest}
      render={() =>
        userAuth?.isAdmin ? <Component {...rest} /> : <Redirect to="/login" />
      }
    />
  );
};
