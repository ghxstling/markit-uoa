"use client";

import { signIn, signOut, useSession } from "next-auth/react";

// This is an example of how to use the useSession()
// this component is for debugging purposes only

export const UserStatus = () => {
    const { data: session } = useSession();

    if (session) {
        return (
            <>
                Signed in as {session.user!.email} <br />
                <pre>{JSON.stringify(session)}</pre>
                <button onClick={() => signOut()}>Sign out</button>
            </>
        );
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    );
};
