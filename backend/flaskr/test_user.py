import unittest
from flaskr import create_app, db
from flaskr.models import User
from config import Config 

class TestUserModel(unittest.TestCase):

    def setUp(self):
        # Create a test Flask application using the test configuration
        self.app = create_app(Config)
        self.app_context = self.app.app_context()
        self.app_context.push()
        
        # Create the database tables
        db.create_all()

    def tearDown(self):
        # Remove the database tables and the application context
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_user_creation(self):
        # Create a new user
        user = User(public_id="test_public_id", name="Test User", email="test@example.com", password="test_password")
        
        # Add the user to the database
        db.session.add(user)
        db.session.commit()

        # Retrieve the user from the database
        retrieved_user = User.query.filter_by(public_id="test_public_id").first()

        # Assert that the retrieved user matches the created user
        self.assertEqual(retrieved_user.name, "Test User")
        self.assertEqual(retrieved_user.email, "test@example.com")
        self.assertEqual(retrieved_user.password, "test_password")

if __name__ == '__main__':
    unittest.main()

