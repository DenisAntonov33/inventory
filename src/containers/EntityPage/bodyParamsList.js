import React from "react";

export const Instance = props => {
  const { items } = props;

  return (
    <div>
      <ul>
        {items &&
          items.length &&
          items.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  );
};

export default Instance;
