import Image from "next/image";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#202430" }} className="text-white">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Logo + Description */}
        <div className="flex flex-col gap-4">
          <Image
            src="/icons/Logo.svg"
            alt="QuickHire Logo"
            width={140}
            height={36}
          />
          <p className="text-sm text-gray-400 leading-relaxed max-w-[220px]">
            Great platform for the job seeker that passionate about startups.
            Find your dream job easier.
          </p>
        </div>

        {/* Column 2: About */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-white text-base">About</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Companies
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Advice
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-white text-base">Resources</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Help Docs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Guide
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Updates
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-white text-base">
            Get job notifications
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            The latest job news, articles, sent to your inbox weekly.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 bg-white text-gray-800 text-sm px-4 py-3 rounded outline-none placeholder-gray-400"
            />
            <button className="bg-[#4640DE] hover:bg-[#3530c4] transition-colors text-white text-sm font-semibold px-5 py-3 rounded whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mx-6" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-400">
          2021 @ QuickHire. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          {[
            { name: "Facebook", file: "Facebook.svg" },
            { name: "Instagram", file: "Instagram.svg" },
            { name: "Dribbble", file: "Dribbble.svg" },
            { name: "LinkedIn", file: "LinkedIn.svg" },
            { name: "Twitter", file: "Twitter.svg" },
          ].map(({ name, file }) => (
            <a
              key={name}
              href="#"
              aria-label={name}
              className="w-8 h-8 rounded-full bg-[#2d3245] hover:bg-[#4640DE] transition-colors flex items-center justify-center"
            >
              <Image
                src={`/icons/social-media/${file}`}
                alt={name}
                width={10}
                height={10}
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
