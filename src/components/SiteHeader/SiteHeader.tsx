import { Link } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import SiteHeaderLogo from "./SiteHeaderLogo";

export default function SiteHeader() {
  return (
    <header className="px-5 py-3.5 xl:px-10 xl:py-8 grid xl:grid-cols-[1fr_auto_1fr] items-center gap-8">
      <nav className="flex gap-8 items-center justify-start max-xl:hidden">
        <Link to="/">Products</Link>
        <Link to="/">News</Link>
        <Link to="/">Campaigns</Link>
        <Link to="/">Services</Link>
        <Link to="/">Journal</Link>
      </nav>
      <Link to="/">
        <SiteHeaderLogo className="justify-self-center xl:max-w-44 max-w-32" />
      </Link>
      <form className="flex grow justify-end max-xl:hidden">
        <input
          className="focus:outline-none placeholder:text-sm"
          type="search"
          name="search"
          placeholder="Search"
        />
        <button type="submit">
          <SearchIcon size={16} />
        </button>
      </form>
    </header>
  );
}
