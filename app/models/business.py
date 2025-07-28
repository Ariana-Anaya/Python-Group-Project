from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Business(db.Model):
    __tablename__ = 'businesses'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    country = db.Column(db.String(50), nullable=False, default="United States of America")
    zip_code = db.Column(db.String(10), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    price_range = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owner = db.relationship("User", back_populates="businesses")
    reviews = db.relationship("Review", back_populates="business", cascade="all, delete-orphan")
    business_images = db.relationship("BusinessImage", back_populates="business", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'ownerId': self.owner_id,
            'name': self.name,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'zipCode': self.zip_code,
            'category': self.category,
            'description': self.description,
            'priceRange': self.price_range,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }

    def to_dict_with_details(self):
        # Calculate average rating and number of reviews
        avg_rating = 0
        num_reviews = len(self.reviews)
        
        if num_reviews > 0:
            total_stars = sum(review.stars for review in self.reviews)
            avg_rating = round(total_stars / num_reviews, 1)

        # Get preview image
        preview_image = None
        for image in self.business_images:
            if image.preview:
                preview_image = image.url
                break

        basic_dict = self.to_dict()
        basic_dict.update({
            'avgRating': avg_rating,
            'numReviews': num_reviews,
            'previewImage': preview_image,
            'avgStarRating': avg_rating
        })
        
        return basic_dict

    def to_dict_full_details(self):
        basic_dict = self.to_dict_with_details()
        basic_dict.update({
            'BusinessImages': [image.to_dict() for image in self.business_images],
            'Owner': {
                'id': self.owner.id,
                'firstName': self.owner.first_name if hasattr(self.owner, 'first_name') else None,
                'lastName': self.owner.last_name if hasattr(self.owner, 'last_name') else None
            }
        })
        return basic_dict