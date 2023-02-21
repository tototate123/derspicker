import { useEffect, useState } from "react";
import Post from "../post";

export default function IndexPage(ev) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/post")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((posts) => {
        setPosts(posts);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  return (
    <>
      {error && <div className="IndexPageError">Hier sollten eigentlich Artikel angezeigt werden. Leider klappt das momentan nicht. Bitte probiere es später erneut. Das Anmelden bzw. Regestrieren wird auch nicht funktionieren.</div>}
      {posts.length > 0 && posts.map((post) => <Post {...post} />)}
    </>
  );
}
