import React from 'react';

const ProductDelete: React.FC = () => {
  return (
    <div className="container mt-4">
      <h2>Eliminar Producto</h2>
      <p>¿Estás seguro de que deseas eliminar este producto?</p>
      <button className="btn btn-danger">Eliminar</button>
      <button className="btn btn-secondary ms-2">Cancelar</button>
    </div>
  );
};

export default ProductDelete;
