//import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Editor from "../Editor";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../config/firebaseConfig";
import { UserContext } from "../UserContext";

export default function CreatePost() {
  const db = getFirestore(app);
  const storage = getStorage();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { userInfo } = useContext(UserContext);

  console.log(userInfo);
  async function createNewPost(ev) {
    ev.preventDefault();

    if (!title || !summary || !content || !file) {
      alert("Please fill all fields");
      return;
    }

    try {
      setUploadProgress(0);

      const storageRef = ref(storage, `userPosts/${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);

      console.log("File uploaded successfully", snapshot);

      const downloadURL = await getDownloadURL(snapshot.ref);

      const postData = {
        title,
        summary,
        content,
        imageUrl: downloadURL,
        timestamp: new Date().toISOString(),
        creatorId: userInfo.uid,
        creatorName: userInfo.username,
      };

      await addDoc(collection(db, "posts"), postData);

      setRedirect(true);
    } catch (error) {
      console.error("Error creating new post:", error);
      alert("Failed to create post. Please try again.");
    }
  }

  useEffect(() => {
    if (redirect) {
      setTimeout(() => setRedirect(false), 2000);
    }
  }, [redirect]);

  return (
    <div>
      <form onSubmit={createNewPost}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(ev) => setSummary(ev.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(ev) => setFile(ev.target.files[0])}
        />
        <Editor value={content} onChange={setContent} />

        <button style={{ marginTop: "5px" }}>Create Post</button>

        {uploadProgress > 0 && (
          <div>Uploading... ({Math.round(uploadProgress)}%)</div>
        )}
      </form>

      {redirect && <Navigate to="/" replace={true} />}
    </div>
  );
}
