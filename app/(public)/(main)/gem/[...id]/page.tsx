'use client';

import GemDetail from "@reactcomponents/pages/GemDetail";

// Catch-all route to handle all gem IDs
// This ensures that any /gem/* route is handled, even if not pre-generated
// React Router will handle the actual routing client-side via the adapter
// The adapter converts Next.js params (which may be arrays for catch-all routes) 
// to React Router format (strings)

// Generate at least one static file to ensure the route exists
export const generateStaticParams = async () => {
    // Return a placeholder to ensure the route file is generated
    // All actual gem IDs will work via client-side routing
    return [{ id: ['placeholder'] }];
};

export default function GemDetailPage() {
    return <GemDetail />;
}

