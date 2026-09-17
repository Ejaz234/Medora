import os
from typing import Annotated

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Request

from clerk_backend_api import (
    authenticate_request,
    AuthenticateRequestOptions,
)


load_dotenv()

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

if not CLERK_SECRET_KEY:
    raise ValueError("CLERK_SECRET_KEY is not set in .env")


def require_user(request: Request) -> str:
    """
    Verify the Clerk session token and return the authenticated
    Clerk user ID.
    """

    state = authenticate_request(
        request,
        AuthenticateRequestOptions(
            secret_key=CLERK_SECRET_KEY,
            accepts_token=["session_token"],
        ),
    )

    if not state.is_signed_in:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
        )

    return state.payload["sub"]


CurrentUser = Annotated[str, Depends(require_user)]