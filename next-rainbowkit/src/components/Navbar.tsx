import Link from "next/link";
import { ConnectButton } from "../components/ConnectButton";

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between bg-black py-4 px-8">
      <div className="text-xl font-bold hover:text-white">
        <Link href="/">
          <p className="text-white cursor-pointer">BitRift Market</p>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/supplier">
          <p className="text-white cursor-pointer hover:text-blue-200 transition duration-300 ease-in-out bold underline border-b-5 border-white-500">
            Suppliers
          </p>
        </Link>
        <Link href="/verifier">
          <p className="text-white cursor-pointer hover:text-blue-200 transition duration-300 ease-in-out underline border-b-5 border-white-500">
            Verifiers
          </p>
        </Link>
      </div>
      <div>
        <ConnectButton />
      </div>
    </nav>
  );
};

export default Navbar;
