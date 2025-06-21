"use client";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 10);
        }
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={`fixed left-1/2 top-8 z-50 -translate-x-1/2 rounded-xl px-8 py-4 shadow transition-colors duration-300 ${scrolled ? "bg-white" : "transparent"
                }`}
            style={{ minWidth: 1200 }}
        >
            <div className="flex items-center justify-between gap-8 w-full">
                {/* Logo on the left */}
                <Link
                    href="/"
                    className={`font-bold text-lg tracking-wide ${scrolled ? "text-gray-900" : "text-white"
                        }`}
                >
                    Planora
                </Link>
                {/* Links on the right */}
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-4">
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="/"
                                    className={scrolled ? "text-gray-900" : "text-white"}
                                >
                                    Home
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="/about"
                                    className={scrolled ? "text-gray-900" : "text-white"}
                                >
                                    About
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="/generate"
                                    className={scrolled ? "text-gray-900" : "text-white"}
                                >
                                    Generate
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="/contact"
                                    className={scrolled ? "text-gray-900" : "text-white"}
                                >
                                    Contact
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </nav>
    );
}