# seeds/businesses.py

from app.models import db, Business
from app.models.db import environment, SCHEMA

def seed_businesses():
    sample_businesses = [
        # the two originals
        {
            "owner_id": 1,
            "name": "Sample Cafe",
            "description": "A cozy place for coffee and snacks.",
            "category": "Cafe",
            "address": "123 Main St",
            "city": "Sampletown",
            "state": "CA",
            "price": 2
        },
        {
            "owner_id": 2,
            "name": "Tasty Pizza",
            "description": "Best pizza in town.",
            "category": "Restaurant",
            "address": "456 Elm St",
            "city": "Pizzaville",
            "state": "NY",
            "price": 3
        },
        # your ten SF spots
        {
            "owner_id": 3,
            "name": "Sunrise Diner",
            "description": "Classic breakfasts all day.",
            "category": "Diner",
            "address": "101 Morning Rd",
            "city": "San Francisco",
            "state": "CA",
            "price": 1
        },
        {
            "owner_id": 4,
            "name": "Bayview Burgers",
            "description": "All-American burgers and fries.",
            "category": "Restaurant",
            "address": "202 Bay St",
            "city": "San Francisco",
            "state": "CA",
            "price": 2
        },
        {
            "owner_id": 5,
            "name": "Golden Gate Tacos",
            "description": "Authentic tacos & salsas.",
            "category": "Restaurant",
            "address": "303 Golden Gate Ave",
            "city": "San Francisco",
            "state": "CA",
            "price": 1
        },
        {
            "owner_id": 6,
            "name": "Pier 39 Seafood",
            "description": "Fresh seafood with bay views.",
            "category": "Restaurant",
            "address": "400 Pier 39",
            "city": "San Francisco",
            "state": "CA",
            "price": 3
        },
        {
            "owner_id": 7,
            "name": "Mission Pizza",
            "description": "Wood-fired Neapolitan pizza.",
            "category": "Pizza",
            "address": "500 Mission St",
            "city": "San Francisco",
            "state": "CA",
            "price": 2
        },
        {
            "owner_id": 8,
            "name": "Chinatown Express",
            "description": "Quick Asian fusion bowls.",
            "category": "Cafe",
            "address": "600 Grant Ave",
            "city": "San Francisco",
            "state": "CA",
            "price": 1
        },
        {
            "owner_id": 9,
            "name": "Haight Hotdogs",
            "description": "Gourmet hotdogs & creative toppings.",
            "category": "Restaurant",
            "address": "700 Haight St",
            "city": "San Francisco",
            "state": "CA",
            "price": 1
        },
        {
            "owner_id": 10,
            "name": "North Beach Pasta",
            "description": "House-made pasta dishes.",
            "category": "Italian",
            "address": "800 Columbus Ave",
            "city": "San Francisco",
            "state": "CA",
            "price": 3
        },
        {
            "owner_id": 11,
            "name": "SoMa Sushi",
            "description": "Fresh sushi rolls & sashimi.",
            "category": "Sushi Bar",
            "address": "900 3rd St",
            "city": "San Francisco",
            "state": "CA",
            "price": 4
        },
        {
            "owner_id": 12,
            "name": "Sunset Tacos",
            "description": "California-style fish tacos.",
            "category": "Restaurant",
            "address": "1000 Irving St",
            "city": "San Francisco",
            "state": "CA",
            "price": 2
        }
    ]

    for biz in sample_businesses:
        exists = Business.query.filter_by(
            name=biz["name"],
            address=biz["address"],
            city=biz["city"],
            state=biz["state"]
        ).first()
        if not exists:
            db.session.add(Business(**biz))

    db.session.commit()

def undo_businesses():
    if environment == "production":
        db.session.execute(
            f'TRUNCATE TABLE {SCHEMA}.businesses RESTART IDENTITY CASCADE;'
        )
    else:
        db.session.execute('DELETE FROM businesses;')
        db.session.execute(
            'DELETE FROM sqlite_sequence WHERE name="businesses";'
        )
    db.session.commit()