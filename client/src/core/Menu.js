import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#ff9900" };
  else return { color: "#ffffff" };
};

const Menu = ({ history }) => (
  <div>
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link className="nav-link" style={isActive(history, "/")} to="/">
          Trang Chủ
        </Link>
      </li>

      <li className="nav-item">
        <Link
          className={
            history.location.pathname === "/users"
              ? "active nav-link"
              : "not-active nav-link"
          }
          to="/users"
        >
          Người dùng
        </Link>
      </li>

      <li className="nav-item">
        <Link
          to={`/post/create`}
          style={isActive(history, `/post/create`)}
          className="nav-link"
        >
          Tạo bài
        </Link>
      </li>

      {!isAuthenticated() && (
        <React.Fragment>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/signin")}
              to="/signin"
            >
              Đăng nhập{" "}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/signup")}
              to="/signup"
            >
              Đăng ký
            </Link>
          </li>
        </React.Fragment>
      )}

      {isAuthenticated() && isAuthenticated().user.role === "admin" && (
        <li className="nav-item">
          <Link
            to={`/admin`}
            style={isActive(history, `/admin`)}
            className="nav-link"
          >
            Admin
          </Link>
        </li>
      )}

      {isAuthenticated() && (
        <React.Fragment>
          <li className="nav-item">
            <Link
              to={`/findpeople`}
              style={isActive(history, `/findpeople`)}
              className="nav-link"
            >
              Tìm người
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to={`/user/${isAuthenticated().user._id}`}
              style={isActive(history, `/user/${isAuthenticated().user._id}`)}
              className="nav-link"
            >
              {`${isAuthenticated().user.name}'s profile`}
            </Link>
          </li>

          <li className="nav-item">
            <span
              className="nav-link"
              style={{ cursor: "pointer", color: "#fff" }}
              onClick={() => signout(() => history.push("/"))}
            >
              Đăng xuất
            </span>
          </li>
        </React.Fragment>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
