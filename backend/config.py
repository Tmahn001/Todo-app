import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))

load_dotenv(os.path.join(basedir, ".env"))


class Config(object):
    SECRET_KEY = os.getenv("SECRET_KEY")
    #SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "todo_app.db")
    #SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    #SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL'].replace("://", "ql://", 1)
    uri = "postgres://fxoazgzvydkyjs:4e09f3012b385041cd8492bac37f7d23b55a8ec0cd989871fb76afe8e594e726@ec2-44-208-206-97.compute-1.amazonaws.com:5432/dev5gkmhv7dng4"
    # or other relevant config var
    if uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URI = uri

    SQLALCHEMY_TRACK_MODIFICATIONS = False
