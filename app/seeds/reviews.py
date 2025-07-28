from app.models import db, Review, ReviewImage, environment, SCHEMA
from sqlalchemy.sql import text


def seed_reviews():
    review1 = Review(
        user_id=1,
        business_id=2,
        review='Great burgers! Perfect for late night coding sessions.',
        stars=5
    )
    
    review2 = Review(
        user_id=2,
        business_id=1,
        review='Love the atmosphere, coffee is decent.',
        stars=4
    )
    
    review3 = Review(
        user_id=3,
        business_id=1,
        review='Coffee was a bit bitter for my taste.',
        stars=3
    )
    
    review4 = Review(
        user_id=1,
        business_id=3,
        review='Pizza was amazing! Fast delivery too.',
        stars=5
    )
    
    review5 = Review(
        user_id=2,
        business_id=3,
        review='Good pizza but service was slow.',
        stars=3
    )

    db.session.add(review1)
    db.session.add(review2)
    db.session.add(review3)
    db.session.add(review4)
    db.session.add(review5)
    db.session.commit()

    # Add some review images
    review_image1 = ReviewImage(
        review_id=1,
        url='https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop&crop=center'
    )
    
    review_image2 = ReviewImage(
        review_id=4,
        url='https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop&crop=center'
    )

    db.session.add(review_image1)
    db.session.add(review_image2)
    db.session.commit()


def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.review_images RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM review_images"))
        db.session.execute(text("DELETE FROM reviews"))
        
    db.session.commit()