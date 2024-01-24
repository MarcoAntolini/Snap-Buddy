import { PageHeader, PageHeaderDescription, PageHeaderHeading, PageHeaderSection } from "@/components/page-header";
import Image from "next/image";

export default function Page() {
	return (
		<div className="container relative">
			<PageHeader>
				<Image src="/logo.png" alt="logo" width={120} height={120} />
				<PageHeaderHeading>Welcome to Snap Buddy</PageHeaderHeading>
				<PageHeaderDescription>
					The perfect website to improve your experience while playing Marvel Snap and help you with some useful tools.
				</PageHeaderDescription>
				<PageHeaderSection>
					If you have any feature request or bug report, please open an issue on{" "}
					<a
						className="underline underline-offset-2"
						href="https://github.com/MarcoAntolini/Snap-Buddy"
						target="_blank"
						rel="noreferrer"
					>
						GitHub
					</a>
					.
				</PageHeaderSection>
			</PageHeader>
		</div>
	);
}
