import { createAuthClient } from "better-auth/react"
import { adminClient, phoneNumberClient } from "better-auth/client/plugins"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000", 
     plugins: [
        adminClient(),
        phoneNumberClient(),

    ]
})

export const { useSession, getSession} = authClient