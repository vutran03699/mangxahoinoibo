import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";

class Comment extends Component {
  state = {
    text: "",
    error: "",
  };

  handleChange = (event) => {
    this.setState({ error: "" });
    this.setState({ text: event.target.value });
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.length > 150) {
      this.setState({
        error: "Nhận xét không được để trống và dài dưới 150 ký tự",
      });
      return false;
    }
    return true;
  };

  addComment = (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      this.setState({ error: "Hãy đăng nhập để bình luận" });
      return false;
    }

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;

      comment(userId, token, postId, { text: this.state.text }).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: "" });
          // gửi danh sách mới của coments đến cha  (SinglePost)
          this.props.updateComments(data.comments);
        }
      });
    }
  };

  deleteComment = (comment) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.updateComments(data.comments);
      }
    });
  };

  deleteConfirmed = (comment) => {
    let answer = window.confirm("Bạn có chắc chắn muốn xóa bình luận của bạn?");
    if (answer) {
      this.deleteComment(comment);
    }
  };

  render() {
    const { comments } = this.props;
    const { error } = this.state;

    return (
      <div>
        <h2 className="mt-5 mb-5"> Để lại bình luận</h2>

        <form onSubmit={this.addComment}>
          <div className="form-group">
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.text}
              className="form-control"
              placeholder="Leave a comment..."
            />
            <button className="btn btn-raised btn-success mt-2">
              Bài đăng{" "}
            </button>
          </div>
        </form>

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <div className="col-md-12">
          <h3 className="text-primary">{comments.length} Bình luận</h3>
          <hr />
          {comments.map((comment, i) => (
            <div key={i}>
              <div>
                <Link to={`/user/${comment.postedBy._id}`}>
                  <img
                    style={{
                      borderRadius: "50%",
                      border: "1px solid black",
                    }}
                    className="float-left mr-2"
                    height="30px"
                    width="30px"
                    onError={(i) => (i.target.src = `${DefaultProfile}`)}
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                    alt={comment.postedBy.name}
                  />
                </Link>
                <div>
                  <p className="lead">{comment.text}</p>
                  <p className="font-italic mark">
                    Bình luận bởi{" "}
                    <Link to={`/user/${comment.postedBy._id}`}>
                      {comment.postedBy.name}{" "}
                    </Link>
                    lúc {new Date(comment.created).toDateString()}
                    <span>
                      {isAuthenticated().user &&
                        isAuthenticated().user._id === comment.postedBy._id && (
                          <>
                            <span
                              onClick={() => this.deleteConfirmed(comment)}
                              className="text-danger float-right mr-1"
                            >
                              Xóa
                            </span>
                          </>
                        )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Comment;
