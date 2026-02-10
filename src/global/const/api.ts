// export const API_BASE_URL = "http://localhost:8080/api";
export const API_BASE_URL =
	window.location.hostname === "localhost"
		? "http://localhost:8080/api"
		: "/api";
