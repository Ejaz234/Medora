import { useAuth } from "@clerk/react";

export function useAuthToken() {
  const { getToken } = useAuth();

  const getAuthToken = async (): Promise<string> => {
    const token = await getToken();

    if (!token) {
      throw new Error("Authentication required.");
    }

    return token;
  };

  return {
    getAuthToken,
  };
}