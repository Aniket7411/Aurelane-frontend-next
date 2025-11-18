'use client';

import GemDetail from "@reactcomponents/pages/GemDetail";

// Catch-all route to handle all gem IDs
// This ensures that any /gem/* route is handled, even if not pre-generated
// React Router will handle the actual routing client-side via the adapter
// The adapter converts Next.js params (which may be arrays for catch-all routes) 
// to React Router format (strings)
//
// Note: With static export, catch-all routes generate a single file that handles
// all paths. No need for generateStaticParams in client components.

export default function GemDetailPage() {
    return <GemDetail />;
}

