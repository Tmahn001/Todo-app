from flaskr import create_app, db
from flaskr.models import Task
from flask_cors import CORS


app = create_app()

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})


@app.shell_context_processor
def make_shell_context():
    return {"db": db, "Task": Task}
