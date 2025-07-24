from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Business, BusinessImage, Review, User, db
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError


business_routes = Blueprint('businesses', __name__)


@business_routes.route('/')
def get_all_businesses():
    """
    Get all businesses with optional query filters
    """
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    size = request.args.get('size', 20, type=int)
    category = request.args.get('category', type=str)
    min_rating = request.args.get('minRating', type=float)
    city = request.args.get('city', type=str)
    price_range = request.args.get('priceRange', type=str)

    # Validate parameters
    if page < 1:
        return jsonify({
            "message": "Bad Request",
            "errors": {"page": "Page must be greater than or equal to 1"}
        }), 400
    
    if size < 1 or size > 20:
        return jsonify({
            "message": "Bad Request", 
            "errors": {"size": "Size must be between 1 and 20"}
        }), 400

    # Start with base query
    query = Business.query

    # Apply filters
    if category:
        query = query.filter(Business.category.ilike(f'%{category}%'))
    
    if city:
        query = query.filter(Business.city.ilike(f'%{city}%'))
        
    if price_range:
        query = query.filter(Business.price_range == price_range)

    # For rating filter, we need to join with reviews
    if min_rating:
        subquery = db.session.query(
            Review.business_id,
            func.avg(Review.stars).label('avg_rating')
        ).group_by(Review.business_id).subquery()
        
        query = query.join(subquery, Business.id == subquery.c.business_id)
        query = query.filter(subquery.c.avg_rating >= min_rating)

    # Paginate
    offset = (page - 1) * size
    businesses = query.offset(offset).limit(size).all()

    return jsonify({
        "Businesses": [business.to_dict_with_details() for business in businesses],
        "page": page,
        "size": size
    })


@business_routes.route('/current')
@login_required
def get_current_user_businesses():
    """
    Get all businesses owned by the current user
    """
    businesses = Business.query.filter(Business.owner_id == current_user.id).all()
    
    return jsonify({
        "Businesses": [business.to_dict_with_details() for business in businesses]
    })


@business_routes.route('/<int:business_id>')
def get_business_details(business_id):
    """
    Get details of a business by id
    """
    business = Business.query.get(business_id)
    
    if not business:
        return jsonify({"message": "Business couldn't be found"}), 404
    
    return jsonify(business.to_dict_full_details())


@business_routes.route('/', methods=['POST'])
@login_required
def create_business():
    """
    Create a new business
    """
    data = request.get_json()
    
    # Validation
    errors = {}
    
    if not data.get('address'):
        errors['address'] = "Street address is required"
    if not data.get('city'):
        errors['city'] = "City is required"
    if not data.get('state'):
        errors['state'] = "State is required"
    if not data.get('country'):
        errors['country'] = "Country is required"
    if not data.get('zipCode'):
        errors['zipCode'] = "Zip code is required"
    if not data.get('category'):
        errors['category'] = "Category is required"
    if not data.get('name') or len(data.get('name', '')) > 50:
        errors['name'] = "Name must be less than 50 characters"
    if not data.get('description'):
        errors['description'] = "Description is required"
    if not data.get('priceRange'):
        errors['priceRange'] = "Price range is required"
    
    if errors:
        return jsonify({
            "message": "Bad Request",
            "errors": errors
        }), 400
    
    # Create business
    business = Business(
        owner_id=current_user.id,
        name=data['name'],
        address=data['address'],
        city=data['city'],
        state=data['state'],
        country=data.get('country', 'United States of America'),
        zip_code=data['zipCode'],
        category=data['category'],
        description=data['description'],
        price_range=data['priceRange']
    )
    
    try:
        db.session.add(business)
        db.session.commit()
        return jsonify(business.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500


@business_routes.route('/<int:business_id>', methods=['PUT'])
@login_required
def edit_business(business_id):
    """
    Edit a business
    """
    business = Business.query.get(business_id)
    
    if not business:
        return jsonify({"message": "Business couldn't be found"}), 404
    
    if business.owner_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
    data = request.get_json()
    
    # Validation
    errors = {}
    
    if not data.get('address'):
        errors['address'] = "Street address is required"
    if not data.get('city'):
        errors['city'] = "City is required"
    if not data.get('state'):
        errors['state'] = "State is required"
    if not data.get('country'):
        errors['country'] = "Country is required"
    if not data.get('zipCode'):
        errors['zipCode'] = "zipCode is required"
    if not data.get('category'):
        errors['category'] = "Category is required"
    if not data.get('name') or len(data.get('name', '')) > 50:
        errors['name'] = "Name must be less than 50 characters"
    if not data.get('description'):
        errors['description'] = "Description is required"
    if not data.get('priceRange'):
        errors['priceRange'] = "Price range is required"
    
    if errors:
        return jsonify({
            "message": "Bad Request",
            "errors": errors
        }), 400
    
    # Update business
    business.name = data['name']
    business.address = data['address']
    business.city = data['city']
    business.state = data['state']
    business.country = data.get('country', 'United States of America')
    business.zip_code = data['zipCode']
    business.category = data['category']
    business.description = data['description']
    business.price_range = data['priceRange']
    
    try:
        db.session.commit()
        return jsonify(business.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500


@business_routes.route('/<int:business_id>', methods=['DELETE'])
@login_required
def delete_business(business_id):
    """
    Delete a business
    """
    business = Business.query.get(business_id)
    
    if not business:
        return jsonify({"message": "Business couldn't be found"}), 404
    
    if business.owner_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
    try:
        db.session.delete(business)
        db.session.commit()
        return jsonify({"message": "Successfully deleted"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500


@business_routes.route('/<int:business_id>/images', methods=['POST'])
@login_required
def add_business_image(business_id):
    """
    Add an image to a business
    """
    business = Business.query.get(business_id)
    
    if not business:
        return jsonify({"message": "Business couldn't be found"}), 404
    
    if business.owner_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
    data = request.get_json()
    
    image = BusinessImage(
        business_id=business_id,
        user_id=current_user.id,
        url=data['url'],
        preview=data.get('preview', False)
    )
    
    try:
        db.session.add(image)
        db.session.commit()
        return jsonify(image.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500


@business_routes.route('/<int:business_id>/reviews')
def get_business_reviews(business_id):
    """
    Get all reviews for a business
    """
    business = Business.query.get(business_id)
    
    if not business:
        return jsonify({"message": "Business couldn't be found"}), 404
    
    reviews = Review.query.filter(Review.business_id == business_id).all()
    
    review_list = []
    for review in reviews:
        review_dict = review.to_dict()
        review_dict.update({
            'User': {
                'id': review.user.id,
                'firstName': review.user.first_name,
                'lastName': review.user.last_name
            },
            'ReviewImages': [image.to_dict() for image in review.review_images]
        })
        review_list.append(review_dict)
    
    return jsonify({"Reviews": review_list})


@business_routes.route('/<int:business_id>/reviews', methods=['POST'])
@login_required
def create_business_review(business_id):
    """
    Create a review for a business
    """
    business = Business.query.get(business_id)
    
    if not business:
        return jsonify({"message": "Business couldn't be found"}), 404
    
    # Check if user already has a review for this business
    existing_review = Review.query.filter(
        Review.user_id == current_user.id,
        Review.business_id == business_id
    ).first()
    
    if existing_review:
        return jsonify({"message": "User already has a review for this business"}), 500
    
    data = request.get_json()
    
    # Validation
    errors = {}
    
    if not data.get('review'):
        errors['review'] = "Review text is required"
    if not data.get('stars') or not isinstance(data.get('stars'), int) or data.get('stars') < 1 or data.get('stars') > 5:
        errors['stars'] = "Stars must be an integer from 1 to 5"
    
    if errors:
        return jsonify({
            "message": "Bad Request",
            "errors": errors
        }), 400
    
    review = Review(
        user_id=current_user.id,
        business_id=business_id,
        review=data['review'],
        stars=data['stars']
    )
    
    try:
        db.session.add(review)
        db.session.commit()
        return jsonify(review.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "User already has a review for this business"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500