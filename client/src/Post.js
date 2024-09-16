import React from "react";
import { Link } from "react-router-dom";

const Post = ({ id, title, summary, imageUrl, content }) => {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${id}`}>
          <img src={imageUrl} alt={`Post img for ${title}`} />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
};

export default Post;
