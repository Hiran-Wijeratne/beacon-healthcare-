import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "#why-beacon", label: "Why Beacon" },
  { href: "#courses", label: "Courses" },
  { href: "#corporate", label: "Corporate" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="px-6 py-6">
      <div className="flex w-full items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/Beacon Healthcare Pte Ltd Logo.png"
            alt="Beacon Healthcare Pte Ltd"
            width={290}
            height={149}
            priority
            className="h-14 w-auto mix-blend-multiply sm:h-16"
          />
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 sm:text-base"
          >
            Register for Courses
          </a>
        </div>
      </div>
    </header>
  );
}
