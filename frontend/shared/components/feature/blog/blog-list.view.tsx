import React from "react";
import { BlogHeader } from "./components/blog-header";
import { BlogGrid } from "./components/blog-grid";
import { BlogSidebar } from "./components/blog-sidebar";

const BlogListPage = () => {
  return (
    <>
      <BlogHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <BlogGrid />
          </div>
          <aside className="lg:w-80 flex-shrink-0">
            <BlogSidebar />
          </aside>
        </div>
      </div>
    </>
  );
};

export default BlogListPage;
