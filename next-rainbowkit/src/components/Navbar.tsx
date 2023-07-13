import Link from "next/link";
import { ConnectButton } from "../components/ConnectButton";

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between bg-gray-100 py-4 px-8">
      <div className="text-xl font-bold hover:text-blue-600">
        <Link href="/">
          Art Platform
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/supplier">
          <p className="text-gray-700 hover:text-blue-600 ">Suppliers</p>
        </Link>
        <Link href="/verifier">
          <p className="text-gray-700 hover:text-blue-600">Verifiers</p>
        </Link>
      </div>
      <button>
        <ConnectButton />
      </button>
    </nav>
  );
};

export default Navbar;
