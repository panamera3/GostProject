import React from 'react';

const Table = ({ className, headers, renderBody }) => {
  return (
    <table className={className}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{renderBody()}</tbody>
    </table>
  );
};

export default Table;
