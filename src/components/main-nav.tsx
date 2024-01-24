"use client";

import { navLinks } from "@/data/links";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainNav() {
	const pathname = usePathname();

	return (
		<div className="mr-4 hidden md:flex">
			<Link href="/" className="mr-6 flex items-center space-x-2">
				<Image src="/logo.png" alt="logo" width={24} height={24} className="h-6 w-6" />
				<span className="hidden font-bold sm:inline-block">Snap Buddy</span>
			</Link>
			<nav className="flex items-center gap-6 text-sm">
				{navLinks.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className={cn(
							"transition-colors hover:text-foreground/80",
							pathname.startsWith(link.href) ? "text-foreground" : "text-foreground/60",
						)}
					>
						{link.name}
					</Link>
				))}
				<span className="text-foreground/60">More features coming soon...</span>
			</nav>
		</div>
	);
}
