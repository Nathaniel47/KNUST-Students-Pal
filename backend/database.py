from sqlalchemy import create_engine, Column, Integer, String, DateTime
<<<<<<< HEAD
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL

=======
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:password@localhost/db_name"
>>>>>>> d98c52a478820b0c4d43107ab99ae23ae7ee364d

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
<<<<<<< HEAD


# print(f"Database URL: {DATABASE_URL}")
=======
>>>>>>> d98c52a478820b0c4d43107ab99ae23ae7ee364d
