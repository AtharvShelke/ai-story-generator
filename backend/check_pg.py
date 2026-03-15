from sqlalchemy import create_engine, inspect
from core.config import settings

def check_tables():
    engine = create_engine(settings.DATABASE_URL)
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Tables in Postgres: {tables}")

if __name__ == "__main__":
    check_tables()
