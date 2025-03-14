import sideImage from "../../../assets/signup-signin.jpeg";
import quote from "../../../assets/quote.svg";

const SideImage = () => {
  return (
    <aside
      className="w-1/2 bg-[#0B0F3B] shadow-md flex flex-col "
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.9)), url(${sideImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mt-[55%] ml-[60px] mr-[40px]">
        <img
          src={quote}
          alt="blue elipse with double quotation"
          className="w-18 mb-[20px]"
        />
        <h2 className="text-white text-[40px] font-[600] leading-[1.2] mb-[12px]">
          Let’s simplify your
          <br /> transactions effortlessly
        </h2>
        <p className="text-white">
          We’re not here to sell you on Receiplty, we’re here to show you
          <br />
          that we believe in seamless, smart, and stress-free digital
          <br />
          receipts, just like you do.
        </p>
      </div>
    </aside>
  );
};

export default SideImage;
