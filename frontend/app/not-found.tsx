"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Prompt Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The prompt you're looking for doesn't exist or may have been
            removed. Don't worry, we have thousands of other amazing prompts
            waiting for you!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button asChild>
            <Link href="/prompts">
              <Search className="h-4 w-4 mr-2" />
              Browse All Prompts
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            Need help?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
