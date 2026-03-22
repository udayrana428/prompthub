import React from "react";
import { BlogSidebar } from "./components/blog-sidebar";
import { BlogPost } from "./components/blog-post";

const BlogDetailPage = ({ post }: { post: any }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <article className="flex-1">
          <BlogPost post={post} />
        </article>
        <aside className="lg:w-80 flex-shrink-0">
          <BlogSidebar />
        </aside>
      </div>
    </div>
  );
};

export default BlogDetailPage;
