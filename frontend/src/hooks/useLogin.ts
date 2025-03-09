import { useMutation } from "@tanstack/react-query";

const API_URL = "http://localhost:8080/api/login";

const loginUser = async (email: string, password: string) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al iniciar sesión");
  }

  const data = await response.json();
  localStorage.setItem("token", data.token); // Guardar el token
  return data;
};

export const LOGIN_KEY = "LOGIN";

const useLogin = () => {
  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
    retry: false,
  });

  return {
    login: mutation.mutate,
    ...mutation,
  };
};

export default useLogin;
