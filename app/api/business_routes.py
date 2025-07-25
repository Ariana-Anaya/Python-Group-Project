from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Business

business_routes = Blueprint('businesses', __name__)

# GET /api/businesses - get all businesses
@business_routes.route('/', methods=['GET'])
def get_all_businesses():
    businesses = Business.query.all()
    print(businesses)
    return {"businesses": [biz.to_dict() for biz in businesses]}
    # return ([biz.to_dict() for biz in businesses]), 200

# GET /api/businesses/<int:id> - get business by id
@business_routes.route('/<int:id>', methods=['GET'])
def get_business(id):
    biz = Business.query.get(id)
    if not biz:
        return {'message': 'Business not found'}, 404
    return biz.to_dict(), 200

# POST /api/businesses - create a new business
@business_routes.route('/', methods=['POST'])
@login_required
def create_business():
    data = request.get_json()
    required_fields = ['name', 'description', 'category', 'address', 'city', 'state', 'price']
    for field in required_fields:
        if not data.get(field):
            return {'error': 'Missing {field}'}, 400
    business = Business(
        owner_id=current_user.id,
        name=data['name'],
        description=data['description'],
        category=data['category'],
        address=data['address'],
        city=data['city'],
        state=data['state'],
        price=data['price']
    )
    db.session.add(business)
    db.session.commit()
    return business.to_dict(), 201

# PUT /api/businesses/<int:id> - edit business
@business_routes.route('/<int:id>', methods=['PUT'])
@login_required
def edit_business(id):
    biz = Business.query.get(id)
    if not biz:
        return {'message': 'Business not found'}, 404
    if biz.owner_id != current_user.id:
        return {'error': 'Forbidden'}, 403
    data = request.get_json()
    for key in ['name', 'description', 'category', 'address', 'city', 'state', 'price']:
        if key in data:
            setattr(biz, key, data[key])
    db.session.commit()
    return biz.to_dict(), 200

# DELETE /api/businesses/<int:id> - delete business
@business_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_business(id):
    biz = Business.query.get(id)
    if not biz:
        return {'message': 'Business not found'}, 404
    if biz.owner_id != current_user.id:
        return {'error': 'Forbidden'}, 403
    db.session.delete(biz)
    db.session.commit()
    return {'message': 'Business deleted'}, 200
    #07/24-update
