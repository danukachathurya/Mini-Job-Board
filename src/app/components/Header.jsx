"use client";
import { Button, Navbar, TextInput, Dropdown, Avatar } from "flowbite-react";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const path = usePathname();
  const { data: session, status } = useSession();

  return (
    <Navbar className="border-b-2">
      <Link
        href="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Mini
        </span>
        Jobs
      </Link>

      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        {status === "authenticated" ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={
                  session.user.image ||
                  "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                }
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{session.user.name}</span>
              <span className="block truncate text-sm font-medium">
                {session.user.email}
              </span>
            </Dropdown.Header>
            <Link href="/dashboard">
              <Dropdown.Item>Dashboard</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <>
            <Link href="/auth/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button gradientDuoTone="pinkToOrange">Sign Up</Button>
            </Link>
          </>
        )}
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Link href="/">
          <Navbar.Link active={path === "/"} as="div">
            Home
          </Navbar.Link>
        </Link>
        {status === "authenticated" && (
          <Link href="/dashboard">
            <Navbar.Link active={path === "/dashboard"} as="div">
              Dashboard
            </Navbar.Link>
          </Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
