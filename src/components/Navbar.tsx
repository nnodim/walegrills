import Image from "next/image";
import { Input } from "./ui/input";
import { Search, User2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const Links = [
  { name: "Home", href: "/" },
  { name: "Booking", href: "/booking" },
];

export const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center gap-4">
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
      <div className="px-4 py-4 sm:px-6 lg:px-8 bg-[#E6EFFD]">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4 justify-between">
            {Links.map((link, index) => (
              <Link href={`${link.href}`} key={index}>
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex justify-between items-center gap-4">
            <Button className="rounded-full text-black bg-white">
              <User2 /> <span>login / register</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
