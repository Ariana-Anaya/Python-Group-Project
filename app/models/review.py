from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime



class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    #business_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("businesses.id")), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    user = db.relationship("User", back_populates="reviews")
    #business = db.relationship("Business", back_populates="reviews")

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            #'business': self.business_id,
            'rating' : self.rating,
            'content' : self.content,
            'createdAt' : self.created_at,
            'updatedAt' : self.updated_at
        }

