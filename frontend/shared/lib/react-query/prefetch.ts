// **"Why prefetch.ts?"**
// Without it your SSR pages show a loading flash — data fetched on server is thrown away and re-fetched on client. This directly hurts SEO and UX.

// Created FRESH for every incoming server request
// React's cache() ensures it's shared within ONE request
// but never bleeds between different users' requests
// Thrown away after request completes — never touches browser

// shared/lib/react-query/prefetch.ts
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// One QueryClient per request on the server
export const getServerQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: { staleTime: 60 * 1000 },
      },
    }),
);

// (main)/prompts/[slug]/page.tsx — Server Component
// import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// import { getServerQueryClient } from "@/shared/lib/react-query/prefetch";

// export default async function PromptDetailPage({ params }) {
//   const queryClient = getServerQueryClient();

//   // Prefetch on server
//   await queryClient.prefetchQuery({
//     queryKey: ["prompts", "detail", params.slug],
//     queryFn: () => promptApi.getBySlug(params.slug),
//   });

//   return (
//     // Pass server data to client — no loading flash
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <PromptDetailView slug={params.slug} />
//     </HydrationBoundary>
//   );
// }
// ```

// ---

// ## Rendering Strategy Per Route Group

// | Route Group | Strategy | Why |
// |---|---|---|
// | `(main)/` | SSR + SSG + ISR | SEO-critical, public |
// | `(auth)/` | CSR | No SEO needed, simple forms |
// | `(account)/` | SSR for initial + CSR | Auth-protected but user-specific |
// | `(admin)/` | CSR only | No SEO, auth-protected, dashboard |

// ---

// ## Summary of What to Add
// ```
// 1. shared/lib/seo/index.ts        ← fill with metadata builders
// 2. shared/lib/react-query/prefetch.ts  ← server QueryClient factory
// 3. public/robots.txt              ← block /admin/ from indexing
// 4. (admin)/layout.tsx             ← "use client" at top
// 5. generateMetadata() in all (main)/ pages
