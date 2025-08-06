#!/usr/bin/env python3

from core.config import settings
from db.database import engine
from sqlalchemy import text

def test_connection():
    try:
        print(f"Database URL: {settings.DATABASE_URL}")
        print("Testing PostgreSQL connection...")
        
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("Connection successful!")
            
            # Check if tables exist
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = [row[0] for row in result]
            print(f"Existing tables: {tables}")
            
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_connection() 