"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { logoutUser } from "@/services/authService";
import Link from "next/link";

type NavbarProps = {
  session?: boolean;
  userName?: string;
  email?: string;
};

const Navbarpage = ({ session, userName, email }: NavbarProps) => {
  const router = useRouter();
  const { user, loading, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const handleLogout = async () => {
    try {
      setUser(null);
      await logoutUser();
      router.replace("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  if (loading) return null;

  function handleAccount(): void {
    router.push("/users/account");
  }

  return (
    <>
      <div className="w-full h-20  shadow-inner flex px-8">
        <div className="flex justify-between w-full text-white text-sm ">
          {/* ซ้าย */}
          <div className="flex items-center px-24 ">
            {/* pt-6   */}
            <a
              href=" / "
              className="text-2xl bg-linear-to-r from-white via-[#5E84FF] to-[#005EFF] bg-clip-text text-transparent font-semibold"
            >
              donate.app
            </a>
          </div>

          {/* ขวา */}
          <div className="flex gap-6 items-center">
            <a href="/manual" className="text-xl hover:text-[#5E84FF]">
              วิธีใช้งาน
            </a>
            <a href="/contact" className="text-xl hover:text-[#5E84FF]">
              ติดต่อ
            </a>
            {!user && (
              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="text-xl px-3 py-2 rounded-full bg-[#0A0F30] border border-[#1E2A78] text-[#5E84FF] hover:bg-[#11183d] transition"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="text-xl px-3 py-2 rounded-full bg-[#0A0F30] border border-[#1E2A78] text-[#5E84FF] shadow-lg hover:bg-[#11183d] transition"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
            {user && (
              <div className="relative">
                {/* Profile Card */}
                <div
                  className="
        grid grid-cols-5 gap-2 w-64 px-3 py-2 mr-20
        bg-[#003af87f] border-2 border-black rounded-full
        transition-all duration-300
        hover:scale-105 hover:shadow-xl
      "
                >
                  {/* Avatar */}
                  <div className="col-span-1 flex items-center">
                    <Image
                      src={`http://localhost:8000/images/profiles/${user.imageUser || "avatar1.avif"}`}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                      unoptimized
                    />
                  </div>

                  {/* User Info */}
                  <div
                    onClick={() => handleAccount()}
                    className="col-span-3 flex flex-col justify-center text-white text-xs">
                    <span className="font-semibold truncate">
                      {user.userName ?? ""}
                    </span>
                    <span className="opacity-80 truncate">
                      {user.email ?? ""}
                    </span>
                  </div>

                  {/* Dropdown Button */}
                  <div className="col-span-1 flex items-center justify-end">
                    <button
                      onClick={() => handleLogout()}
                      className="
            w-6 h-6 flex items-center justify-center
            rounded-full bg-white/20
            hover:bg-white/40
            transition pi pi-chevron-down
          "
                    ></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Navbarpage;
