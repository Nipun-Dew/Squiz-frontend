/** @type {import('next').NextConfig} */


// proxy setup for different origins of server and frontend
export default {
    async rewrites() {
        return [
            {
                source: '/api/:path*', // Proxy requests starting with /api
                destination: 'http://localhost:8080/api/:path*', // Redirect to the backend
            },
        ];
    },
};
