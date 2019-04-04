import React from "react";

export const Instance = props => {
  const { items, removeHandler } = props;

  const removeButton = id => (
    <span
      onClick={e => {
        e.preventDefault();
        removeHandler(id);
      }}
    >
      x
    </span>
  );

  return (
    <div>
      <ul>
        {items &&
          items
            .filter(e => !e.isDeleted)
            .sort((a, b) => b.createdAt - a.createdAt)
            .map(item => (
              <li key={item.id}>
                {item.name} - {removeHandler && removeButton(item.id)}
              </li>
            ))}
      </ul>
    </div>
  );
};

export default Instance;
