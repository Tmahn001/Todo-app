from flask import url_for
import sqlalchemy as sa
from datetime import datetime
from flaskr import db
import bcrypt

class User(db.Model):
    id = sa.Column(sa.Integer, primary_key=True)
    public_id = sa.Column(sa.String(50), unique = True)
    name = sa.Column(sa.String(100))
    email = sa.Column(sa.String(70), unique = True)
    password = sa.Column(sa.String(256))
    tasks = db.relationship('Task', backref='user', lazy=True)

class Category(db.Model):
    id = sa.Column(sa.Integer, primary_key=True)
    name = sa.Column(sa.String(50), unique=True)

    # Define a relationship with tasks
    tasks = db.relationship('Task', backref='category', lazy=True)


class Task(db.Model):
    id_task = sa.Column(sa.Integer, primary_key=True, nullable=False)
    title = sa.Column(sa.String(50), nullable=False)
    description = sa.Column(sa.String(150), nullable=False)
    priority = sa.Column(sa.Boolean, default=False)
    due_date = sa.Column(sa.DateTime)
    timestamp = sa.Column(sa.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', name='fk_task_user_id'), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id', name='fk_task_category_id'), nullable=True)

    def to_dict(self):
        data = {
            "id_task": self.id_task,
            "title": self.title,
            "description": self.description,
            "priority": self.priority,
            "due_date": self.due_date.strftime('%Y-%m-%d %H:%M:%S') if self.due_date else None,
            "timestamp": self.timestamp,
            "user_id": self.user_id,
            "category_id": self.category_id  # Include the category_id in the dictionary
        }

        return data

    def from_dict(self, data):
        for field in ["title", "description", "priority", "due_date", "user_id", "category_id"]:
            if field in data:
                setattr(self, field, data[field])


    @staticmethod
    def to_collection_dict(query, page, per_page, endpoint, **kwargs):
        resources = db.paginate(
            query, page=page, per_page=per_page, error_out=False)

        data = {
            "items": [item.to_dict() for item in resources.items],
            "meta": {
                "page": page,
                "per_page": per_page,
                "total_pages": resources.pages,
                "total_items": resources.total
            },
            "links": {
                "self": url_for(endpoint, page=page, per_page=per_page,
                                **kwargs),
                "next": url_for(endpoint, page=page + 1, per_page=per_page,
                                **kwargs) if resources.has_next else None,
                "prev": url_for(endpoint, page=page - 1, per_page=per_page,
                                **kwargs) if resources.has_prev else None
            }
        }

        return data

    def __repr__(self):
        return f"""
            task:
                id_task: {self.id_task},
                title: {self.title},
                description: {self.description},
                priority: {self.priority},
                due_date: {self.due_date},
                timestamp: {self.timestamp},
                user_id; {self.user_id}
        """
