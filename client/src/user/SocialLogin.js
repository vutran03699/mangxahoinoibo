import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { socialLogin, authenticate } from "../auth";

class SocialLogin extends Component {
  constructor() {
    super();
    this.state = {
      redirectToReferrer: false,
    };
  }

  responseGoogle = (response) => {
    // console.log('response', response);
    const tokenId = response.tokenId;
    const user = {
      tokenId: tokenId,
    };

    socialLogin(user).then((data) => {
      // console.log('signin data: ', data);
      if (data.error) {
        console.log("Lỗi đăng nhập. Vui lòng thử lại..");
      } else {
        // console.log('signin success - setting jwt: ', data);
        authenticate(data, () => {
          console.log("phản hồi đăng nhập xã hội từ api", data);
          this.setState({ redirectToReferrer: true });
        });
      }
    });
  };

  render() {
    // redirect
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer) {
      return <Redirect to="/" />;
    }

    return (
      <GoogleLogin
        clientId="679380407525-2cvoah9gpsjjffc5k1p6atahhf2vqfl4.apps.googleusercontent.com"
        buttonText="Đăng nhập bằng Google"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
      />
    );
  }
}

export default SocialLogin;
