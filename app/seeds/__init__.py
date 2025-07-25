from flask.cli import AppGroup
from .users import seed_users, undo_users
<<<<<<< HEAD
from .businesses import seed_businesses, undo_businesses
=======
from .reviews import seed_reviews, undo_reviews

>>>>>>> a548618ee835d60267971d6f951d94ff6385005c
from app.models.db import db, environment, SCHEMA

seed_commands = AppGroup('seed')

@seed_commands.command('all')
def seed():
    if environment == 'production':
        undo_users()
        undo_reviews()
    seed_users()
<<<<<<< HEAD
    seed_businesses()
=======
    seed_reviews()
    # Add other seed functions here
>>>>>>> a548618ee835d60267971d6f951d94ff6385005c

@seed_commands.command('undo')
def undo():
    undo_users()
<<<<<<< HEAD
    undo_businesses()
=======
    undo_reviews()
    # Add other undo functions here
>>>>>>> a548618ee835d60267971d6f951d94ff6385005c
