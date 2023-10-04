from flaskr.api import bp
from flaskr import db
from flaskr.api.errors import bad_request

from flaskr.models import Task, User, Category
import datetime as usedate
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
import uuid # for public id
from  werkzeug.security import generate_password_hash, check_password_hash
# imports for PyJWT authentication
import jwt
from datetime import timedelta, datetime
from functools import wraps


# creates SQLALCHEMY object


@bp.route('/delete_all_users', methods=['DELETE'])
def delete_all_users():
    try:
        # Delete all user records from the database
        db.session.query(User).delete()
        db.session.commit()
        return jsonify({'message': 'All users have been deleted successfully.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error: {str(e)}'}), 500


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        # return 401 if token is not passed
        if not token:
            return jsonify({'message' : 'Token is missing !!'}), 401
  
        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, 'b038cf9e581981a635bea51b6086dc4e')
            current_user = User.query\
                .filter_by(public_id = data['public_id'])\
                .first()
        except:
            return jsonify({
                'message' : 'Token is invalid !!'
            }), 401
        # returns the current logged in users context to the routes
        return  f(current_user, *args, **kwargs)
  
    return decorated

@bp.route('/users', methods =['GET'])
@token_required
def get_all_users(current_user):
    # querying the database
    # for all the entries in it
    users = User.query.all()
    # converting the query objects
    # to list of jsons
    output = []
    for user in users:
        # appending the user data json
        # to the response list
        output.append({
            'public_id': user.public_id,
            'name' : user.name,
            'email' : user.email
        })
  
    return jsonify({'users': output})

@bp.route('/user', methods=['GET'])
@token_required  # Protect this route with authentication
def get_user_details(current_user):
    # Get the current user's details from the `current_user` object
    user_details = {
        'public_id': current_user.public_id,
        'name': current_user.name,
        'email': current_user.email
    }

    return jsonify(user_details), 200


@bp.route('/login', methods =['POST'])
def login():
    # Get user credentials from the form data
    auth = request.form
    email = auth.get('email')
    password = auth.get('password')

    # Check if email and password are provided
    if not email or not password:
        return make_response(jsonify({'error': 'Email and password are required'}), 400)

    # Check if the user with the provided email exists
    user = User.query.filter_by(email=email).first()

    if not user:
        return make_response(jsonify({'error': 'User does not exist'}), 401)

    # Check if the provided password matches the user's password
    if not check_password_hash(user.password, password):
        return make_response(jsonify({'error': 'Wrong password'}), 403)

    # Generate a JWT token for the authenticated user
    token = jwt.encode({
        'public_id': user.public_id,
        'exp': datetime.utcnow() + timedelta(minutes=30)
    }, 'b038cf9e581981a635bea51b6086dc4e')

    return jsonify({'token': token.decode('UTF-8')}), 200

@bp.route('/signup', methods=['POST'])
def signup():
    # creates a dictionary of the form data
    data = request.form

    # gets name, email, and password
    name, email, password = data.get('name'), data.get('email'), data.get('password')

    # Check if any of the required fields are missing
    if not name or not email or not password:
        return make_response(jsonify({'error': 'Missing name, email, or password.'}), 400)

    # checking for an existing user
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return make_response(jsonify({'error': 'User already exists. Please log in.'}),202)

    # Create a new user
    new_user = User(
        public_id=str(uuid.uuid4()),
        name=name,
        email=email,
        password=generate_password_hash(password)
    )

    # Insert the new user into the database
    db.session.add(new_user)
    db.session.commit()

    return make_response(jsonify({"error":"Successfully registered."}), 201)


@bp.route("/tasks/<int:id_task>", methods=["GET"])
def get_task(id_task):
    task = db.get_or_404(Task, id_task)

    return jsonify(task.to_dict())


@bp.route("/tasks", methods=["GET"])
@token_required
def get_tasks(current_user):
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 6, type=int), 100)
    category = request.args.get("category")
    search_query = request.args.get("search")

    # Start with all tasks for the current user
    tasks_query = Task.query.filter_by(user_id=current_user.id)

    # Apply category filter if category is provided
    if category:
        tasks_query = tasks_query.filter(Task.category_id == category)

    # Apply search filter if search_query is provided
    if search_query:
        # You can adjust the filter conditions based on your needs
        tasks_query = tasks_query.filter(
            (Task.title.ilike(f"%{search_query}%")) |
            (Task.description.ilike(f"%{search_query}%"))
        )

    data = Task.to_collection_dict(
        tasks_query.order_by(Task.priority.desc(), Task.id_task),
        page, per_page, "api.get_tasks"
    )

    return data


@bp.route("/categories", methods=["GET"])
def get_categories():
    categories = Category.query.all()
    category_list = [{"id": category.id, "name": category.name} for category in categories]
    return jsonify(categories=category_list)

@bp.route("/categories", methods=["POST"])
def add_category():
    data = request.get_json()

    if "name" not in data:
        return jsonify({"error": "Category name is required"}), 400

    name = data["name"]

    # Check if a category with the same name already exists
    existing_category = Category.query.filter_by(name=name).first()
    if existing_category:
        return jsonify({"error": "Category with this name already exists"}), 400

    new_category = Category(name=name)

    db.session.add(new_category)
    db.session.commit()

    return jsonify({"message": "Category added successfully"}), 201

@bp.route("/tasks", methods=["POST"])
@token_required
def create_task(current_user):  # Add current_user as an argument
    data = request.get_json() or {}

    if "title" not in data or "description" not in data:
        return bad_request("Must include title and description fields!")

    # Get the due date string
    due_date_string = data.get("due_date")

    # Check if due date is supplied
    if due_date_string is not None:
        # Convert the due date string to a Python datetime object
        due_date = usedate.datetime.fromisoformat(due_date_string)
    else:
        due_date = None  # No due date provided

    task = Task()
    task.from_dict(data)

    # Associate the task with the logged-in user
    task.user_id = current_user.id  # Assuming you have a 'user_id' field in the Task model

    # Set the due_date attribute
    task.due_date = due_date

    db.session.add(task)
    db.session.commit()

    response = jsonify(task.to_dict())
    response.status_code = 201

    return response



@bp.route("/tasks/<int:id_task>", methods=["PUT"])
def update_task(id_task):
    data = request.get_json() or {}
    task = db.get_or_404(Task, id_task)

    task.from_dict(data)

    db.session.commit()

    return jsonify(task.to_dict())


@bp.route("/tasks/<int:id_task>", methods=["DELETE"])
def delete_task(id_task):
    task = db.get_or_404(Task, id_task)

    db.session.delete(task)
    db.session.commit()

    return "", 204
