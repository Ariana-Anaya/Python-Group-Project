from flask.cli import AppGroup
from .users import seed_users, undo_users
from .businesses import seed_businesses, undo_businesses
from app.models.db import db, environment, SCHEMA

seed_commands = AppGroup('seed')

@seed_commands.command('all')
def seed():
    if environment == 'production':
        undo_users()
    seed_users()
    seed_businesses()

@seed_commands.command('undo')
def undo():
    undo_users()
    undo_businesses()
