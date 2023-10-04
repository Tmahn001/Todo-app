import unittest
from flaskr import create_app, db
from flaskr.models import Task, User, Category
from datetime import datetime
from config import Config

class TestTaskModel(unittest.TestCase):
    def setUp(self):
        self.app = create_app(Config)
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_task_creation(self):
        # Create a user
        user = User(public_id='test_user', name='Test User', email='test@example.com', password='password')
        db.session.add(user)
        db.session.commit()

        # Create a category 
        category = Category(name='Test Category')
        db.session.add(category)
        db.session.commit()

        # Create a task
        task = Task(title='Test Task', description='This is a test task', priority=True, due_date=datetime.utcnow(), user=user, category=category)
        db.session.add(task)
        db.session.commit()

        # Retrieve the task from the database
        retrieved_task = Task.query.filter_by(title='Test Task').first()

        # Check if the task and its attributes are correctly stored in the database
        self.assertIsNotNone(retrieved_task)
        self.assertEqual(retrieved_task.title, 'Test Task')
        self.assertEqual(retrieved_task.description, 'This is a test task')
        self.assertTrue(retrieved_task.priority)
        self.assertIsNotNone(retrieved_task.due_date)
        self.assertEqual(retrieved_task.user, user)
        self.assertEqual(retrieved_task.category, category)

if __name__ == '__main__':
    unittest.main()