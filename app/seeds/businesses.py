from app.models import db, Business, BusinessImage, environment, SCHEMA
from sqlalchemy.sql import text


def seed_businesses():
    business1 = Business(
        owner_id=1,
        name='Coder Cafe',
        address='123 Disney Lane',
        city='Los Angeles',
        state='California',
        country='United States of America',
        zip_code='90210',
        category='Cafe',
        description='Best coffee in town',
        price_range='$$'
    )
    
    business2 = Business(
        owner_id=2,
        name='Tech Burger',
        address='456 Silicon Valley Rd',
        city='San Francisco',
        state='California',
        country='United States of America',
        zip_code='94102',
        category='Restaurant',
        description='Gourmet burgers for developers',
        price_range='$$$'
    )
    
    business3 = Business(
        owner_id=3,
        name='Pizza & Code',
        address='789 Startup St',
        city='Austin',
        state='Texas',
        country='United States of America',
        zip_code='78701',
        category='Pizza',
        description='Late night coding fuel',
        price_range='$'
    )

    db.session.add(business1)
    db.session.add(business2)
    db.session.add(business3)
    db.session.commit()

    # Add some business images with real placeholder URLs
    image1 = BusinessImage(
        business_id=1,
        user_id=1,  # Business owner uploaded this
        url='https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop&crop=center',
        preview=True
    )
    
    image2 = BusinessImage(
        business_id=1,
        user_id=2,  # Different user uploaded this
        url='https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop&crop=center',
        preview=False
    )
    
    image3 = BusinessImage(
        business_id=2,
        user_id=2,  # Business owner uploaded this
        url='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center',
        preview=True
    )
    
    image4 = BusinessImage(
        business_id=3,
        user_id=3,  # Business owner uploaded this
        url='https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&crop=center',
        preview=True
    )

    db.session.add(image1)
    db.session.add(image2)
    db.session.add(image3)
    db.session.add(image4)
    db.session.commit()


def undo_businesses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.business_images RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.businesses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM business_images"))
        db.session.execute(text("DELETE FROM businesses"))
        
    db.session.commit()