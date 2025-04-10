import { SidebarTrigger } from "@/components/ui/sidebar"
import { AuthButton } from "@/modules/auth/ui/components/auth-button"
import Image from "next/image"
import Link from "next/link"
import { StudioUploadModal } from "../studio-upload-modal"

export const StudioNavbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 flex items-center px-2 pr-5 z-50 bg-white dark:bg-accent border-b shadow-md">
            <div className="flex items-center gap-4 w-full">
                <div className="flex items-center shrink-0">
                    <SidebarTrigger />
                    <Link prefetch href="/studio" className="hidden md:block">
                        <div className="p-4 flex items-center gap-1">
                            <Image src="/yt-logo.svg" width={32} height={32} alt="logo" />
                            <p className="text-xl font-semibold tracking-tight">Studio</p>
                        </div>
                    </Link>
                </div>

                <div className="flex-1"></div>
                <div className="flex shrink-0 items-center gap-4">
                    <StudioUploadModal />
                    <AuthButton />
                </div>
            </div>
        </nav>
    )
}