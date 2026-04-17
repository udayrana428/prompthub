"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Building,
  Camera,
  Gamepad2,
  Mountain,
  Palette,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { categoryApi } from "@/shared/api";
import { queryKeys } from "@/shared/lib/react-query/keys";
import { Card, CardContent } from "@/shared/components/ui/card";

const categoryIcons = [
  { icon: Camera, color: "text-blue-600" },
  { icon: Palette, color: "text-fuchsia-600" },
  { icon: Sparkles, color: "text-pink-600" },
  { icon: Zap, color: "text-orange-600" },
  { icon: Mountain, color: "text-green-600" },
  { icon: Building, color: "text-slate-600" },
  { icon: Users, color: "text-rose-600" },
  { icon: Gamepad2, color: "text-indigo-600" },
];

export function CategoriesGrid() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.categories.list({ limit: 12, isActive: true }),
    queryFn: () =>
      categoryApi.client.listCategories({ limit: 12, isActive: true }),
    staleTime: 1000 * 60 * 10,
  });

  const categories = (data?.data.data ?? []).slice(0, 8);

  return (
    <section className="py-6 lg:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
            Browse by Category
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explore the world of AI prompts with our curated collection of
            categories.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-sm text-muted-foreground">
            Loading categories...
          </div>
        ) : isError ? (
          <div className="text-center text-sm text-destructive">
            Categories could not be loaded.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => {
              const config = categoryIcons[index % categoryIcons.length];
              const IconComponent = config.icon;

              return (
                <Link
                  key={category.id}
                  href={`/prompts?category=${category.slug}`}
                >
                  <Card className="group border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-4 flex items-center justify-between">
                        <div
                          className={`rounded-lg bg-background p-3 ${config.color}`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {category.children.length > 0
                            ? `${category.children.length} subcats`
                            : ""}
                        </span>
                      </div>
                      <h3 className="mb-2 font-semibold text-card-foreground transition-colors group-hover:text-primary">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
                        {category.description ||
                          "Browse prompts available in this category."}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
