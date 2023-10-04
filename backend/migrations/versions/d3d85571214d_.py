"""empty message

Revision ID: d3d85571214d
Revises: 
Create Date: 2023-10-03 00:41:18.624154

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd3d85571214d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('public_id', sa.String(length=50), nullable=True),
    sa.Column('name', sa.String(length=100), nullable=True),
    sa.Column('email', sa.String(length=70), nullable=True),
    sa.Column('password', sa.String(length=80), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('public_id')
    )
    op.create_table('task',
    sa.Column('id_task', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=50), nullable=False),
    sa.Column('description', sa.String(length=150), nullable=False),
    sa.Column('priority', sa.Boolean(), nullable=True),
    sa.Column('due_date', sa.DateTime(), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='fk_task_user_id'),
    sa.PrimaryKeyConstraint('id_task')
    )
    with op.batch_alter_table('task', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_task_timestamp'), ['timestamp'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('task', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_task_timestamp'))

    op.drop_table('task')
    op.drop_table('user')
    # ### end Alembic commands ###
