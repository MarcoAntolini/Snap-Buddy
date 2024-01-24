import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 max-w-screen-2xl items-center">
				<MainNav />
				<MobileNav />
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<nav className="flex items-center">
						<Link href="https://github.com/MarcoAntolini/Snap-Buddy" target="_blank" rel="noreferrer">
							<div
								className={cn(
									buttonVariants({
										variant: "ghost",
									}),
									"w-9 px-0",
								)}
							>
								<FaGithub className="h-4 w-4" />
								<span className="sr-only">GitHub</span>
							</div>
						</Link>
						<ThemeToggle />
					</nav>
				</div>
			</div>
		</header>
	);
}
