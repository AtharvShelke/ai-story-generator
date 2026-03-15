from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.orm import Session
from core.config import settings
from db.database import get_db
from models.user import User
from schemas.token import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/auth/login", auto_error=False)

def get_current_user_optional(token: str | None = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        return None
        
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str | None = payload.get("sub")
        if username is None:
            return None
        token_data = TokenData(username=username)
    except Exception:
        return None
        
    user = db.query(User).filter(User.username == token_data.username).first()
    return user

def get_current_user(user: User | None = Depends(get_current_user_optional)):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
