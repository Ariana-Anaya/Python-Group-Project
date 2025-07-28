# models/business.py

from sqlalchemy import UniqueConstraint
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Business(db.Model):
    __tablename__ = 'businesses'

    # Apply schema + unique constraint together
    if environment == "production":
        __table_args__ = (
            UniqueConstraint('name', 'address', 'city', 'state',
                             name='uix_business_location'),
            {'schema': SCHEMA}
        )
    else:
        __table_args__ = (
            UniqueConstraint('name', 'address', 'city', 'state',
                             name='uix_business_location'),
        )

    id          = db.Column(db.Integer, primary_key=True)
    owner_id    = db.Column(db.Integer,
                            db.ForeignKey(add_prefix_for_prod("users.id")),
                            nullable=False)
    name        = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text,    nullable=False)
    category    = db.Column(db.String(50), nullable=False)
    address     = db.Column(db.String(200), nullable=False)
    city        = db.Column(db.String(50), nullable=False)
    state       = db.Column(db.String(2),  nullable=False)
    price       = db.Column(db.Integer,    nullable=False)

    owner = db.relationship("User", back_populates="businesses")
    reviews = db.relationship("Review", back_populates="business")

    def to_dict(self):
        return {
            'id':          self.id,
            'owner_id':    self.owner_id,
            'name':        self.name,
            'description': self.description,
            'category':    self.category,
            'address':     self.address,
            'city':        self.city,
            'state':       self.state,
            'price':       self.price,
        }


# from .db import db, environment, SCHEMA, add_prefix_for_prod

# class Business(db.Model):
#     __tablename__ = 'businesses'

#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
#     name = db.Column(db.String(100), nullable=False)
#     description = db.Column(db.Text, nullable=False)
#     category = db.Column(db.String(50), nullable=False)
#     address = db.Column(db.String(200), nullable=False)
#     city = db.Column(db.String(50), nullable=False)
#     state = db.Column(db.String(2), nullable=False)
#     price = db.Column(db.Integer, nullable=False)

#     owner = db.relationship("User", back_populates="businesses")

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'owner_id': self.owner_id,
#             'name': self.name,
#             'description': self.description,
#             'category': self.category,
#             'address': self.address,
#             'city': self.city,
#             'state': self.state,
#             'price': self.price,
#         }
