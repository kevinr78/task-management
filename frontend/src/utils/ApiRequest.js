const sendAPIRequest = async function (method, body = null, endpoint) {
  const options = {};
  options.method = method;
  options.headers = {
    "Content-Type": "application/json",
  };

  if (endpoint !== "register" || endpoint !== "login") {
    const token = localStorage.getItem("token");
    options.headers["Authorization"] = "Bearer " + token;
  }

  if (method === "POST") {
    options.body = JSON.stringify(body);
  }

  const fechtRequest = await fetch(
    `http://localhost:8080/${endpoint}`,
    options
  );
  const response = await fechtRequest.json();

  if (!response.ok) {
    throw new Error(response.message);
  }
  return response;
};

export default sendAPIRequest;
