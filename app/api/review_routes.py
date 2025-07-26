from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Review, ReviewImage, Business, User, db


review_routes = Blueprint('reviews', __name__)


@review_routes.route('/<int:review_id>')
def get_review_details(review_id):
    """
    Get details of a review by id
    """
    review = Review.query.get(review_id)
    
    if not review:
        return jsonify({"message": "Review couldn't be found"}), 404
    
    return jsonify(review.to_dict_with_user_business())


@review_routes.route('/<int:review_id>', methods=['PUT'])
@login_required
def edit_review(review_id):
    """
    Edit a review
    """
    review = Review.query.get(review_id)
    
    if not review:
        return jsonify({"message": "Review couldn't be found"}), 404
    
    if review.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
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
    
    # Update review
    review.review = data['review']
    review.stars = data['stars']
    
    try:
        db.session.commit()
        return jsonify(review.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500


@review_routes.route('/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review(review_id):
    """
    Delete a review
    """
    review = Review.query.get(review_id)
    
    if not review:
        return jsonify({"message": "Review couldn't be found"}), 404
    
    if review.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
    try:
        db.session.delete(review)
        db.session.commit()
        return jsonify({"message": "Successfully deleted"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500


@review_routes.route('/<int:review_id>/images', methods=['POST'])
@login_required
def add_review_image(review_id):
    """
    Add an image to a review
    """
    review = Review.query.get(review_id)
    
    if not review:
        return jsonify({"message": "Review couldn't be found"}), 404
    
    if review.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
    # Check if review already has 10 images
    if len(review.review_images) >= 10:
        return jsonify({"message": "Maximum number of images for this resource was reached"}), 403
    
    data = request.get_json()
    
    image = ReviewImage(
        review_id=review_id,
        url=data['url']
    )
    
    try:
        db.session.add(image)
     #07/24-update
        db.session.commit()
        return jsonify(image.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500
>>>>>>> 5c776976358a24ef6c071c0bd3ff65232b85bda3
