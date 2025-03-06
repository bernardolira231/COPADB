import { useMutation } from "@tanstack/react-query";

const mockUsers = [
  {
    id: 1,
    name: "Administrador",
    lastname: "General",
    email: "admin@cedb.com",
    password: "123456",
    rol: 1,
  },
  {
    id: 2,
    name: "Juan",
    lastname: "Pérez",
    email: "user@cedb.com",
    password: "password",
    rol: 2,
  },
];

const makeTime = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const mockLogin = async (email: string, password: string) => {
  await makeTime(1000);

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) {
    throw new Error("Credenciales incorrectas");
  }

  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    rol: user.rol,
  };
};

export const LOGIN_KEY = "LOGIN";

const useLogin = () => {
  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      mockLogin(email, password),
    retry: false,
  });

  return {
    login: mutation.mutate,
    ...mutation,
  };
};

export default useLogin;
