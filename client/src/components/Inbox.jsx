import React, { useEffect, useState } from 'react';

export default function Inbox({ username }) {
  const [messages, setMessages] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      fetch(`http://localhost:5000/api/inbox/${username}`)
        .then(res => res.json())
        .then(setMessages);
    }
  }, [show, username]);

  return (
    <div style={{ position: 'relative' }}>
      <button className="btn btn-light" onClick={() => setShow(s => !s)}>
        <i className="bi bi-inbox"></i>
        {messages.some(m => !m.read) && <span className="badge bg-danger">{messages.filter(m => !m.read).length}</span>}
      </button>
      {show && (
        <div className="card p-2" style={{ position: 'absolute', right: 0, zIndex: 10, minWidth: 300 }}>
          <h6>Inbox</h6>
          {messages.length === 0 && <div>No messages</div>}
          <ul className="list-group">
            {messages.map(msg => (
              <li key={msg._id} className={`list-group-item ${msg.read ? '' : 'fw-bold'}`}>
                {msg.message}
                <br />
                <small className="text-muted">{new Date(msg.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}