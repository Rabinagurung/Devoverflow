interface SignInWithOAuthParams {
  user: {
    email: string;
    name: string;
    username: string;
    image: string;
  };
  provider: "google" | "github";
  providerAccountId: string;
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}
