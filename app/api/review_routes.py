from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Review, Business #Images

review_routes = Blueprint('reviews', __name__)
#get reviews by user
@review_routes.route('/user/<int:user_id>/reviews')
@login_required
def get_user_reviews(user_id):
    if current_user.id != user_id:
        return {'errors': {'message': 'Unauthorized'}}, 401
    reviews = Review.query.filter_by(user_id=user_id).all()
    return jsonify({'Reviews': [review.to_dict() for review in reviews]})

#get reviews by business
@review_routes.route('/businesses/<int:business_id>/reviews')
def get_business_reviews(business_id):
    business = Business.query.get(business_id)
    if not business:
        return {'message': 'Business not found'}, 404

    reviews = Review.query.filter_by(business_id=business_id).all()
    return jsonify({'Reviews': [review.to_dict() for review in reviews]})

#create review
@review_routes.route('/businesses/<int:business_id>/reviews', methods=['POST'])
@login_required
def create_review(business_id):
    business = Business.query.get(business_id)
    if not business:
        return {'message': 'Business not found'}, 404
    
    data = request.get_json()

    new_review = Review(
        user_id=current_user.id,
        business_id=business_id,
        rating=data.get('rating'),
        content=data.get('content')
    )

    db.session.add(new_review)
    db.session.commit()

    return new_review.to_dict(), 201

#update existing review
@review_routes.route('/reviews/<int:review_id>', methods=['PUT'])
@login_required
def update_review(review_id):
    review = Review.query.get(review_id)
    if not review:
        return {'message': 'Review not found'}, 404
    if review.user_id != current_user.id:
        return {'message': 'Not Authorized'}, 403
    
    data = request.get_json()

    review.rating = data.get('rating', review.rating)
    review.content = data.get('content', review.content)

    db.session.commit()

    return review.to_dict()

#add image to review
"""@review_routes.route('/reviews/<int:review_id>/images', methods=['POST']
@login_required
def add_review_image(review_id):
    review = Review.query.get(review_id)
    if not review:
        return {'message': 'Review not found'}, 404
    if review.user_id != current_user.id:
        return {'message': 'Not Authorized'}, 403
    
    data = request.get_json()
    url = data.get('url')

    image = ReviewImage(review_id=review_id, url=url)
    db.session.add(image)
    db.session.commit()

    return jsonify(image.to_dict), 201"""

#delete review
@review_routes.route('/reviews/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review(review_id):
    review = Review.query.get(review_id)
    if not review:
        return {'message': 'Review not found'}, 404
    if review.user_id != current_user.id:
        return {'message': 'Not Authorized'}, 403
    
    db.session.delete(review)
    db.session.commit()
    return {'message': 'Review deleted'}

#get review by id
@review_routes.route('/reviews/<int:review_id>')
def get_review_by_id(review_id):
    review = Review.query.get(review_id)
    if not review:
        return {'message': 'Review not found'}, 404
    
    return review.to_dict()


