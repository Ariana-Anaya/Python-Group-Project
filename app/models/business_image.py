from .db import db, environment, SCHEMA, add_prefix_for_prod


class BusinessImage(db.Model):
    __tablename__ = 'business_images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("businesses.id")), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=True)
    url = db.Column(db.String(255), nullable=False)
    preview = db.Column(db.Boolean, nullable=False, default=False)

    # Relationships
    business = db.relationship("Business", back_populates="business_images")
    user = db.relationship("User")

    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'preview': self.preview,
            'userId': self.user_id
        }