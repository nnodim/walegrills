"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Search, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const navLinks = [
  { label: "Home", href: "https://walegrills.com" },
  { label: "Food", href: "https://walegrills.com/shop/" },
  { label: "Bookings", href: "/bookings" },
  { label: "Meal Plan", href: "/" },
  { label: "About Us", href: "https://walegrills.com/about/" },
  { label: "Portfolio", href: "https://walegrills.com/portfolio/" },
  { label: "Blog", href: "https://walegrills.com/blog/" },
  { label: "Our Contact", href: "https://walegrills.com/contact/" },
];

export const Navbar = () => {
  const pathname = usePathname();

  // Function to check if a link is active
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 hidden lg:block">
        <div className="flex justify-between items-center gap-4">
          <Image
            src="/Logo.png"
            alt="Walegrills Logo"
            className="dark:invert"
            width={100}
            height={24}
            priority
          />
          <div className="relative pl-4 pr-20 h-[46px] w-full border rounded-full">
            <Input
              placeholder="Search for products"
              className="border-none shadow-none h-full w-full"
            />
            <span className="absolute right-1 top-0.5 bg-[#C4A484] text-white p-2 rounded-full">
              <Search />
            </span>
          </div>

          <div className="flex flex-col text-sm">
            <p>24 Support</p>
            <p className="text-blue-600 whitespace-nowrap">+1 212-334-0212</p>
          </div>
        </div>
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-4 justify-between text-xs">
              {navLinks.map((link, index) => (
                <Link
                  href={`${link.href}`}
                  key={index}
                  className={`transition-colors duration-200 px-3 py-2 rounded-full ${
                    isActive(link.href)
                      ? "text-[rgb(196,164,132)] font-medium bg-[rgb(196,164,132)]/20"
                      : "hover:text-[rgb(196,164,132)] hover:bg-[rgb(196,164,132)]/20"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex justify-between items-center gap-4">
              <Link
                href="/https://walegrills.com/my-account/"
                className="rounded-full text-black bg-white flex justify-between items-center gap-2 px-4 py-2 text-xs"
              >
                <User2 /> <span>login / register</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 lg:hidden">
        <div className="flex justify-between items-center gap-4 mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="sr-only">
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you&#39;re
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="">
                <div className="flex flex-col items-center justify-between">
                  {navLinks.map((link, index) => (
                    <Link
                      href={`${link.href}`}
                      key={index}
                      className={`transition-colors duration-200 px-3 py-4 w-full border-b ${
                        isActive(link.href)
                          ? "text-[rgb(196,164,132)] font-medium bg-[rgb(196,164,132)]/20"
                          : "hover:text-[rgb(196,164,132)] hover:bg-[rgb(196,164,132)]/20"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Image
            src="/Logo.png"
            alt="Walegrills Logo"
            className="dark:invert"
            width={100}
            height={24}
            priority
          />
          <div className="flex justify-between items-center gap-4">
            <Link
              href="/https://walegrills.com/my-account/"
              className="rounded-full text-black bg-white flex justify-between items-center gap-2 px-4 py-2"
            >
              <User2 />
            </Link>
          </div>
        </div>
        <div className="relative pl-4 pr-20 h-[46px] w-full border rounded-full">
          <Input
            placeholder="Search for products"
            className="border-none shadow-none h-full w-full"
          />
          <span className="absolute right-1 top-0.5 bg-[#C4A484] text-white p-2 rounded-full">
            <Search />
          </span>
        </div>
      </div>
    </header>
  );
};
