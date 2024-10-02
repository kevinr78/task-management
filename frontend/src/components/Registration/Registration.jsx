import { useState } from "react";
import sendAPIRequest from "../../utils/ApiRequest";
import { Form, useNavigate } from "react-router-dom";

export default function Example() {
  const navigate = useNavigate();
  const [isRegister, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    email: null,
    password: null,
    confirmPassword: null,
    formType: "register",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      formType: isRegister ? "register" : "login",
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endPoint = isRegister ? "register" : "login";
    console.log(formData);
    const { ok, token, name } = await sendAPIRequest(
      "POST",
      formData,
      endPoint
    );

    if (!ok) {
      console.error(
        `Error while ${isRegister ? "registering" : "logging in"} user `
      );
      return;
    }
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    navigate("/home");
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {isRegister ? "Create an account" : "Login"}
            </h1>
            <form className="space-y-4 md:space-y-6" method="POST">
              {isRegister && (
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Full Name"
                    required={true}
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Email"
                  required={true}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={handleChange}
                  placeholder="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required={true}
                />
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full text-white bg-sky-950 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {isRegister ? " Create an account" : "Login"}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                {isRegister ? " Already have an account?" : "New Here?"}{" "}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  onClick={() => {
                    setIsRegistering(!isRegister);
                  }}
                >
                  {isRegister ? "Login Here" : "Create Account"}
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
