import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../../api/auth";
import SideImage from "./SideImage";
import Logo from "../../../assets/Receiptly-Blue-Whole.svg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessIndustry, setBusinessIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  // const [industorySelected, setIndustorySelected] = useState("");
  // const [countrySelected, setCountrySelected] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await register(
        name,
        email,
        password,
        businessName,
        businessIndustry,
        country,
        businessAddress
      );
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleRegister();
    }
  };

  const handleIndustoryChange = (e) => {
    setIndustorySelected(e.target.value);
  };

  const handleCountryChange = (e) => {
    setCountrySelected(e.target.value);
  };

  return (
    <div className="flex h-screen">
      <SideImage />
      <div className="flex flex-col items-center h-screen bg-white w-1/2 overflow-y-auto overflow-x-hidden">
        <div className="flex justify-end w-full">
          <p className="text-gray-500 mt-3 mr-[60px]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#2E39E6]">
              <u>Sign in</u>
            </Link>
          </p>
        </div>

        <div className="flex justify-start w-full ml-[60px] mt-[10%]">
          <form
            className="bg-white rounded px-8 pt-6 pb-8 mb-4"
            onKeyPress={handleKeyPress}
          >
            <img src={Logo} alt="Receiptly logo" className="w-42 mb-[20px]" />
            <h2 className="text-left text-3xl">Get Started with Receiptly</h2>
            <h4 className=" py-2 mb-[20px]">
              Welcome to a smarter way to manage receipts! Sign up now and start
              <br></br>
              enjoying paperless transactions, and always at your fingertips.
            </h4>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow-xs appearance-none border border-gray-200 rounded w-[70%] py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow-xs appearance-none border border-gray-200 rounded w-[70%] py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400"
                placeholder="sample@receiptly.com"
              />
            </div>
            <div className="mb-6 relative">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow-xs appearance-none border border-gray-200 rounded w-[70%] py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400"
                placeholder="Create a password"
              />
              <span
                className="absolute right-40 top-9 text-sm text-blue-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <u className="text-[#2E39E6]">
                  {showPassword ? "Hide" : "Show"}
                </u>
              </span>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="businessName"
              >
                Business name
              </label>
              <input
                type="businessName"
                id="businessName"
                placeholder="Langara"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="shadow-xs appearance-none border border-gray-200 rounded w-[70%] py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="businessIndustry"
              >
                Business Industry
              </label>
              <select
                id="businessIndustry"
                className={` ${
                  businessIndustry === "" ? "text-gray-400" : "text-black"
                } shadow-xs appearance-none border border-gray-200 rounded w-[70%] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400`}
                onChange={(e) => setBusinessIndustry(e.target.value)}
                value={businessIndustry}
              >
                <option value="">Select an industry</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="retail">Retail</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="country"
              >
                Country
              </label>
              <select
                id="country"
                className={` ${
                  country === "" ? "text-gray-400" : "text-black"
                } shadow-xs appearance-none border border-gray-200 rounded w-[70%] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400`}
                onChange={(e) => setCountry(e.target.value)}
                value={country}
              >
                <option value="">Select a country</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="jp">Japan</option>
                <option value="uk">United Kingdom</option>
                <option value="de">Germany</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="businessAddress"
              >
                Business address
              </label>
              <input
                type="businessAddress"
                id="businessAddress"
                placeholder="Enter your business address"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="shadow-xs appearance-none border border-gray-200 rounded w-[70%] py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400"
              />
            </div>
            <div>
              <p>
                By clicking 'Create an Account', you agree to the
                <br></br>
                <u className="text-[#2E39E6] cursor-pointer">
                  Terms of Service{" "}
                </u>
                and
                <u className="text-[#2E39E6] cursor-pointer"> Privacy Policy</u>
                .
              </p>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleRegister}
                className="mt-[28px] bg-[#2E39E6] hover:bg-white text-white hover:text-[#2E39E6] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-[70%] hover:border hover:border-[#2E39E6] cursor-pointer"
              >
                Create an Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
