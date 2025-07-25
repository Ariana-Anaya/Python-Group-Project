from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import BusinessImage, ReviewImage, Business, Review, db


image_routes = Blueprint('images', __name__)


@image_routes.route('/business-images/<int:image_id>', methods=['DELETE'])
@login_required
def delete_business_image(image_id):
    """
    Delete a business image
    """
    image = BusinessImage.query.get(image_id)
    
    if not image:
        return jsonify({"message": "Business Image couldn't be found"}), 404
    
    # Check if the current user owns the business or uploaded the image
    if image.business.owner_id != current_user.id and image.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
    try:
        db.session.delete(image)
        db.session.commit()
        return jsonify({"message": "Successfully deleted"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500


@image_routes.route('/review-images/<int:image_id>', methods=['DELETE'])
@login_required
def delete_review_image(image_id):
    """
    Delete a review image
    """
    image = ReviewImage.query.get(image_id)
    
    if not image:
        return jsonify({"message": "Review Image couldn't be found"}), 404
    
    # Check if the current user owns the review
    if image.review.user_id != current_user.id:
        return jsonify({"message": "Forbidden"}), 403
    
    try:
        db.session.delete(image)
        db.session.commit()
        return jsonify({"message": "Successfully deleted"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500