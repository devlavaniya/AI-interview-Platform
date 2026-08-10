import { FaLinkedin, FaGithub } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { Code2, Heart } from "lucide-react";

const socials = [
  {
    Icon: FaLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mayanksharmams/",
  },
  {
    Icon: FaGithub,
    label: "GitHub",
    href: "https://github.com/Mayank12Sharma",
  },
  {
    Icon: SiGmail,
    label: "Gmail",
    href: "mailto:sharmaji123mayank@gmail.com",
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-800 bg-[#090909]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}

          <div className="flex items-center gap-5">
            <img
              src="/profile.png"
              alt="Mayank Sharma"
              className="h-16 w-16 rounded-full border-2 border-yellow-400 object-cover"
            />

            <div>
              <div className="flex items-center gap-3">
                <Code2 className="h-5 w-5 text-yellow-400" />

                <h2 className="text-xl font-bold text-white">IntelliView</h2>
              </div>

              <p className="mt-2 text-zinc-400">
                AI Powered Interview & Coding Platform
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Designed & Developed by Mayank Sharma
              </p>
            </div>
          </div>

          {/* Social */}

          <div className="flex gap-4">
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-[#181818] text-zinc-400 transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div className="my-8 h-px bg-zinc-800" />

        <div className="flex flex-col gap-4 text-center text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} IntelliView. All rights reserved.</p>

          <p className="flex items-center justify-center gap-2">
            Built with
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            by
            <span className="font-semibold text-yellow-400">Mayank Sharma</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
