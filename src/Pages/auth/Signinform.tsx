import { useState } from "react";
import { Link } from "react-router";
//  import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
// import label from "../form/label";
// import input from "../form/input/InputField";
// import Checkbox from "../form/input/Checkbox";
// import Button from "../ui/button/Button";
import ThemeToggleButton from "../../Layout/Header/ThemeToggleButton";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen relative">

      {/* LEFT PANEL (form) */}
      <div className="flex flex-col flex-1 w-full h-full px-5 pt-10 lg:px-10 ">

        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mt-10 lg:mt-0 gap-10">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="flex mb-2 font-semibold text-gray-800 text-xl dark:text-white/90 sm:text-4xl">
                Sign In
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your email and password to sign in!
              </p>
            </div>

            <form>
              <div className="space-y-6  dark:text-gray-400">

                <div>
                  <label>
                    Email <span className="text-error-500">*</span>
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                    placeholder="info@gmail.com"
                  />
                </div>

                <div>
                  <label>
                    Password <span className="text-error-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                    />

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {/* {showPassword ? <EyeIcon /> : <EyeCloseIcon />} */}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* <Checkbox checked={isChecked} onChange={setIsChecked} /> */}
                    {/* <span className="block font-normal text-gray-700 text-sm dark:text-gray-400">
                        Keep me logged in
                      </span> */}
                  </div>
                </div>

                <div>
                  <button className="w-full bg-brand-500 h-10 rounded-lg text-m font-bold text-white">
                    Sign in
                  </button>
                </div>

              </div>
            </form>

          </div>
        </div>
      </div>

      {/* RIGHT PANEL (fixed) */}
      <div className="hidden  w-full lg:grid lg:w-1/2 h-full bg-[#0B1A4B] relative  dark:bg-gray-80">
        <div>
          <img
            src="/assets/images/logo/grid-01.svg "
            alt="pattern"
            className=" absolute w-full z-1 right-0 top-0  max-w-[300px] xl:max-w-[500px]"
          />
        </div>
        <div>
          <img
            src="/assets/images/logo/grid-01.svg "
            alt="pattern"
            className="absolute bottom-0 left-0  w-full max-w-[300px] rotate-180 xl:max-w-[500px]"
          />
        </div>

        <div className="absolute overflow-hidden  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
          <img
            src="/assets/images/logo/logo-dark.svg"
            alt="TailAdmin Logo"
            className="w-60 h-20 "
          />


          <p className="text-gray-300 text-sm flex">
            Free and Open-Source Tailwind CSS Admin<br />
            Dashboard Template
          </p>
        </div>
      </div>

      {/* GLOBAL MOON BUTTON – FIXED ALWAYS */}
      <div className="fixed bottom-5  right-5 ">
        <ThemeToggleButton />
      </div>

    </div>
  );
};

export default SignInForm;
