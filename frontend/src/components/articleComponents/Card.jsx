import React from 'react';
import moment from 'moment';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export const Card = ({
  idTask,
  title,
  description,
  timestamp,
  priority, // Add the priority prop
  getTask,
  deleteTask,
}) => {
  return (
    <div className='cards__card'>
      <h2 className='cards__card-title'>{title}</h2>
      <p className='cards__card-description'>{description}</p>
      <p className='cards__card-timestamp'>
        Created: {moment(timestamp).fromNow()}
      </p>
      <p className='cards__card-priority'>
        {priority ? <span>&#9733;</span> : null}
        {/* Render the star icon if priority is true */}
      </p>
      <div className='cards__card-btns'>
        <button
          className='cards__card-btns_edit'
          type='button'
          onClick={() => getTask(idTask)}
        >
          <FiEdit className='cards__card-btns_icon' />
        </button>
        <button
          className='cards__card-btns_delete'
          type='button'
          onClick={() => deleteTask(idTask)}
        >
          <FiTrash2 className='cards__card-btns_icon' />
        </button>
      </div>
    </div>
  );
};
