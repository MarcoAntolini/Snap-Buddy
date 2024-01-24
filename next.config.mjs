/** @type {import('next').NextConfig} */
const nextConfig = {
	assetPrefix: process.env.NODE_ENV === "production" ? "https://snap-buddy.com" : "",
	images: {
		domains: ["marvelsnapzone.com"],
	},
};

export default nextConfig;
