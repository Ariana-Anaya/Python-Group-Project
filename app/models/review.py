from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    business_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("businesses.id")), nullable=False)
    review = db.Column(db.Text, nullable=False)
    stars = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship("User", back_populates="reviews")
    business = db.relationship("Business", back_populates="reviews")
    review_images = db.relationship("ReviewImage", back_populates="review", cascade="all, delete-orphan")

    # Constraint to ensure one review per user per business
    __table_args__ = (
        db.UniqueConstraint('user_id', 'business_id', name='unique_user_business_review'),
        {'schema': SCHEMA} if environment == "production" else {}
    )

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'businessId': self.business_id,
            'review': self.review,
            'stars': self.stars,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }

    def to_dict_with_user_business(self):
        basic_dict = self.to_dict()
        
        basic_dict.update({
            'User': {
                'id': self.user.id,
                'firstName': self.user.first_name if hasattr(self.user, 'first_name') else None,
                'lastName': self.user.last_name if hasattr(self.user, 'last_name') else None
            },
            'Business': {
                'id': self.business.id,
                'ownerId': self.business.owner_id,
                'address': self.business.address,
                'city': self.business.city,
                'state': self.business.state,
                'country': self.business.country,
                'zipCode': self.business.zip_code,
                'category': self.business.category,
                'name': self.business.name,
                'priceRange': self.business.price_range,
                'previewImage': next((img.url for img in self.business.business_images if img.preview), None)
            },
            'ReviewImages': [image.to_dict() for image in self.review_images]
        })
        
        return basic_dict