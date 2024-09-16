import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { app } from "../config/firebaseConfig";
import { getAuth } from "firebase/auth";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchPostInfo = async () => {
      if (!id) {
        console.error("No post ID provided");
        return;
      }

      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPostInfo({
          ...docSnap.data(),
          id: docSnap.id,
        });
      } else {
        console.log("No document exists!");
      }
    };

    fetchPostInfo();
  }, [id]);

  if (!postInfo) return <div>Loading...</div>;

  const formattedCreatedAt = (() => {
    if (postInfo.createdAt) {
      try {
        return formatISO9075(new Date(postInfo.createdAt));
      } catch (error) {
        console.warn(`Error formatting date: ${error.message}`);
        return "Invalid date";
      }
    }
    return "N/A";
  })();

  const username = userInfo?.username || "Guest";
  console.log("Username in PostPage:", username);

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deleteDoc(doc(db, "posts", id));
      window.location.href = "/"; // Redirect to dashboard after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      {/* {formattedCreatedAt && <time>{formattedCreatedAt}</time>} */}
      {postInfo.creatorName ? (
        <div className="author">by {postInfo.creatorName}</div>
      ) : (
        <div className="author">by anonymus</div>
      )}
      {postInfo.creatorName === username ? (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo.id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Edit this post
          </Link>

          <button className="delete-btn" onClick={handleDeletePost}>
            Delete Post
          </button>
        </div>
      ) : (
        ""
      )}
      <div className="image">
        <img src={postInfo.imageUrl} alt={`Post img for ${postInfo.title}`} />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
}
