import { ReactNode, useEffect, useState } from "react";
import { get } from "./util/http";
import BlogPosts, { BlogPost } from "./components/BlogPosts";
import image from "./assets/data-fetching.png";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>()
  type RawDataBlogPosts = {
    id: number;
    userId: number;
    title: string;
    body: string;
  };

  useEffect(() => {
   
    async function fetchPosts() {
      setLoading(true);
      try {
        const data = (await get(
          "https://jsonplaceholder.typicode.com/posts"
        )) as RawDataBlogPosts[];
        const blogPost = data.map((rawPost) => {
          return {
            id: rawPost.id,
            title: rawPost.title,
            text: rawPost.body,
          };
        });
        setFetchedPosts(blogPost);
      } catch (error) {
        if (error instanceof Error){

          setError(error.message);
        }
      }

     
      setLoading(false);
    }
    fetchPosts();
  }, []);

  let content: ReactNode;
  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  }
  if (loading) {
    content = <p id="loading-fallback">loading...</p>;
  }
  if (error){
    content= <ErrorMessage text={error}/>
  }
  return (
    <main>
      <img src={image} alt="image" />
      {content}
    </main>
  );
}

export default App;
