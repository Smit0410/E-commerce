import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex text-center justify-around bg-gray-700 text-white font-bold">
      <Link to={"/"} className="w-full hover:bg-gray-900">
        Home
      </Link>
      <div>|</div>
      <Link to={"/product"} className="w-full hover:bg-gray-900">
        Product
      </Link>
      <div>|</div>
      <Link to={"/cart"} className="w-full hover:bg-gray-900">
        Cart
      </Link>
    </div>
  );
};

export default Navbar;
