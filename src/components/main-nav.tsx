"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks } from "@/data/links";
import { cn } from "@/lib/utils";

export function MainNav() {
	const pathname = usePathname();

	return (
		<div className="mr-4 hidden md:flex">
			<Link href="/" className="mr-6 flex items-center space-x-2">
				<img src="/logo.png" alt="logo" className="h-6 w-6" />
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
			</nav>
		</div>
	);
}
