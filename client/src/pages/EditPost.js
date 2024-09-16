import React, { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../config/firebaseConfig";
import { UserContext } from "../UserContext";

export default function EditPost() {
  const db = getFirestore(app);
  const storage = getStorage();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data());
          setTitle(docSnap.data().title);
          setSummary(docSnap.data().summary);
          setContent(docSnap.data().content);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
    if (!post || !files) return;

    const storageRef = ref(storage, `userPosts/${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, files);
    console.log("Snapshot:", snapshot);
    console.log("Metadata:", snapshot.metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Download URL:", downloadURL);

    const updatedPost = {
      ...post,
      title,
      summary,
      content,
      imageUrl: downloadURL,
      timestamp: new Date().toISOString(),
      creatorId: userInfo.uid,
      creatorName: userInfo.username,
    };
    console.log("Updated Post:", JSON.stringify(updatedPost, null, 2));

    try {
      await updateDoc(doc(db, "posts", id), updatedPost);
      setRedirect(true);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    }
  }

  if (redirect) {
    return <Navigate to={`/`} replace={true} />;
  }

  return (
    <div>
      <form onSubmit={updatePost}>
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
          onChange={(ev) => setFiles(ev.target.files[0])}
        />
        <Editor value={content} onChange={setContent} />
        <button style={{ marginTop: "5px" }}>Update Post</button>
      </form>

      {redirect && <Navigate to="/" replace={true} />}
    </div>
  );
}
