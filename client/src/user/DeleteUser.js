import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { remove } from "./apiUser";
import { signout } from "../auth";

class DeleteUser extends Component {
  state = {
    redirect: false,
  };

  deleteAccount = () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId;
    remove(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        // signout user
        signout(() => console.log("Người dùng bị xóa"));
        // redirect
        this.setState({ redirect: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm(
      "Bạn có chắc rằng bạn muốn xóa tài khoản của bạn?"
    );
    if (answer) {
      this.deleteAccount();
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <button
        onClick={this.deleteConfirmed}
        className="btn btn-raised btn-danger"
      >
        Xóa hồ sơ
      </button>
    );
  }
}

export default DeleteUser;
