from flask.cli import AppGroup
from .users import seed_users, undo_users
from .businesses import seed_businesses, undo_businesses
from .reviews import seed_reviews, undo_reviews

from app.models.db import db, environment, SCHEMA

seed_commands = AppGroup('seed')

@seed_commands.command('all')
def seed():
    if environment == 'production':
        undo_users()
        undo_reviews()
    seed_users()
    seed_businesses()
    seed_reviews()
    # Add other seed functions here

@seed_commands.command('undo')
def undo():
    undo_users()
    undo_businesses()
    undo_reviews()
    # Add other undo functions here
