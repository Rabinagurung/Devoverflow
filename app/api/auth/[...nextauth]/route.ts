/* [...nextauth] : [] represents dynamic route whereas ... represents catch all segments. 

It means that all the routes that comes after api/auth will be handeled by this route file like: /api/auth/providers 
or /api/auth/signIn or api/auth/signOut/. 
This will help auth.js package to route things properly. It makes sure that we handle sign-in route,
 sign-out route or any other authentication route.  

In simple terms, this is a catch-all dynamic route, which will respond to all the relevant Auth.js 
API routes so that your application can interact with the chosen OAuth provider using the OAuth 2 protocol.
*/

import { handlers } from "@/auth";

export const { GET, POST } = handlers;

//  import handlers and export Get and Post route handlers
