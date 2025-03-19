const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  QUESTIONS: (id: string) => `/questions/${id}`,
  ASK_QUESTION: "/ask-question",
  PROFILE: (_id: string) => `/profile/${_id}`,
  TAGS: (id: string) => `/tags/${id}`,
  SIGN_IN_WITH_OAUTH: "/signin-with-oauth",
};

export default ROUTES;

// It makes less error prone like we will not make typo mistake.
// If sign in route is changed then we can update it on this file and changes will be applied to all pages.
