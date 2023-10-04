import unittest
from flaskr import create_app, db
from flaskr.models import Category
from config import Config

class TestCategoryModel(unittest.TestCase):
    def setUp(self):
        self.app = create_app(Config)  # Use a testing configuration
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_category_creation(self):
        # Create a category
        category = Category(name='Test Category')
        db.session.add(category)
        db.session.commit()

        # Retrieve the category from the database
        retrieved_category = Category.query.filter_by(name='Test Category').first()

        # Check if the category and its attributes are correctly stored in the database
        self.assertIsNotNone(retrieved_category)
        self.assertEqual(retrieved_category.name, 'Test Category')

if __name__ == '__main__':
    unittest.main()
