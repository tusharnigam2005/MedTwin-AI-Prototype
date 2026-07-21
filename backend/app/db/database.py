import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "")

# Smart Fallback: If no explicit cloud/container Postgres URL is set, or if psycopg2 is not installed locally on Windows, use SQLite
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./medtwin_local.db"
elif DATABASE_URL.startswith("postgresql"):
    try:
        import psycopg2
    except ImportError:
        DATABASE_URL = "sqlite:///./medtwin_local.db"

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency provider for database sessions inside FastAPI routes."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
