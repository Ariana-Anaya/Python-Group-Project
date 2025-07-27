from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from werkzeug.security import generate_password_hash

def seed_users():
    demo = User(
        username='Demo', 
        email='demo@aa.io', 
        hashed_password=generate_password_hash('password'),
        first_name='Demo',
        last_name='User'
    )
    marnie = User(
        username='marnie', 
        email='marnie@aa.io', 
        hashed_password=generate_password_hash('password'),
        first_name='Marnie',
        last_name='Smith'
    )
    bobbie = User(
        username='bobbie', 
        email='bobbie@aa.io', 
        hashed_password=generate_password_hash('password'),
        first_name='Bobbie',
        last_name='Hill'
    )

    db.session.add_all([demo, marnie, bobbie])
    db.session.commit()

def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
    db.session.commit()
