from flask import Blueprint, request, jsonify
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required

auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/session')
def authenticate():
    """
    Get the Current User - Returns the information about the current user that is logged in.
    """
    if current_user.is_authenticated:
        return {'user': current_user.to_dict()}
    return {'user': None}


@auth_routes.route('/session', methods=['POST'])
def login():
    """
    #    /api/auth/login    
    #    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return (user.to_dict()), 200
    return (form.errors), 401


@auth_routes.route('/session', methods=['DELETE'])
def logout():
    """
    # {{url}}/api/auth/logout
    # Method: GET
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}




@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401