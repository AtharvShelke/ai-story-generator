from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import URL

from core.config import settings

DATABASE_URL = URL.create(
    drivername="postgresql+psycopg2",
    username=settings.DATABASE_USER,
    password=settings.DATABASE_PASSWORD,
    host=settings.DATABASE_HOST,
    port=settings.DATABASE_PORT,
    database=settings.DATABASE_NAME,
    query={
        "sslmode": "require"
    }
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # avoids stale connections
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_table():
    Base.metadata.create_all(bind=engine)
