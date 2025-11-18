import GemDetailClient from './GemDetailClient';

// Server component wrapper for catch-all route
// generateStaticParams is required for static export with dynamic routes
// For catch-all routes [...id], the id param must be an array
export async function generateStaticParams() {
    try {
        // Try to fetch actual gem IDs from API at build time
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aurelane-backend-next.onrender.com/api';
        const response = await fetch(`${API_BASE_URL}/gems?limit=100&page=1`, {
            cache: 'no-store'
        });

        if (response.ok) {
            const data = await response.json();
            const gems = data.gems || data.data?.gems || [];
            if (gems.length > 0) {
                // For catch-all routes [...id], return array of arrays
                // Each gem ID becomes an array element
                return gems.map((gem: { _id?: string; id?: string }) => ({
                    id: [gem._id || gem.id || 'placeholder']
                }));
            }
        }
    } catch (error) {
        console.log('API not available at build time, using placeholder');
    }

    // Fallback: Return at least one param to ensure route is generated
    // For catch-all routes [...id], id must be an array
    return [
        { id: ['placeholder'] }
    ];
}

// Catch-all route to handle all gem IDs
// This ensures that any /gem/* route is handled, even if not pre-generated
// React Router will handle the actual routing client-side via the adapter
// The adapter converts Next.js params (which may be arrays for catch-all routes) 
// to React Router format (strings)
export default function GemDetailPage() {
    return <GemDetailClient />;
}

