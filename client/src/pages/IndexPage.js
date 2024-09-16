import React, { useState, useEffect } from "react";
import Post from "../Post";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../config/firebaseConfig";

export default function IndexPage() {
  const db = getFirestore(app);
  const [posts, setPosts] = useState([]);

  async function fetchPosts() {
    const querySnapshot = await getDocs(collection(db, "posts"));
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  }

  useEffect(() => {
    const fetchAndSetPosts = async () => {
      try {
        const posts = await fetchPosts();
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchAndSetPosts();
  }, []);

  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => <Post key={post.id} {...post} />)}
    </>
  );
}
