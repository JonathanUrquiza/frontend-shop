import React, { useState } from 'react';

interface SidebarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedLicence: string;
  setSelectedLicence: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  licences: Array<{ licence_id: number; licence_name: string }>;
  categories: Array<{ category_id: number; category_name: string }>;
  onClearFilters: () => void;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange?: (min: number, max: number) => void;
  filters?: {
    nuevos?: boolean;
    ofertas?: boolean;
    edicionEspecial?: boolean;
    favoritos?: boolean;
  };
  onFiltersChange?: (filters: {
    nuevos?: boolean;
    ofertas?: boolean;
    edicionEspecial?: boolean;
    favoritos?: boolean;
  }) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedLicence,
  setSelectedLicence,
  selectedCategory,
  setSelectedCategory,
  licences,
  categories,
  onClearFilters,
  sortBy = 'mayor-precio',
  onSortChange,
  minPrice = 0,
  maxPrice = 0,
  onPriceChange,
  filters = {},
  onFiltersChange
}) => {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice.toString());
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice.toString());
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSearch = () => {
    // La búsqueda ya se aplica automáticamente con el onChange
  };

  const handleViewAll = () => {
    onClearFilters();
    setLocalMinPrice('0');
    setLocalMaxPrice('0');
    setLocalFilters({});
  };

  const handleApplyPriceFilter = () => {
    const min = parseFloat(localMinPrice) || 0;
    const max = parseFloat(localMaxPrice) || 0;
    if (onPriceChange) {
      onPriceChange(min, max);
    }
  };

  const handleFilterChange = (filterName: keyof typeof localFilters) => {
    const newFilters = {
      ...localFilters,
      [filterName]: !localFilters[filterName]
    };
    setLocalFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  return (
    <div className="sidebar-filters">
      {/* BUSCAR Section */}
      <div className="sidebar-section">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Item o categoría"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="search-buttons">
          <button className="btn btn-search" onClick={handleSearch}>
            Buscar
          </button>
          <button className="btn btn-view-all" onClick={handleViewAll}>
            Ver todos
          </button>
        </div>
      </div>

      {/* ORDENAR POR Section */}
      <div className="sidebar-section">
        <label className="sidebar-label">ORDENAR POR</label>
        <select
          className="form-select sidebar-select"
          value={sortBy}
          onChange={(e) => onSortChange && onSortChange(e.target.value)}
        >
          <option value="mayor-precio">Mayor precio</option>
          <option value="menor-precio">Menor precio</option>
          <option value="nombre-asc">Nombre A-Z</option>
          <option value="nombre-desc">Nombre Z-A</option>
          <option value="mas-nuevos">Más nuevos</option>
        </select>
      </div>

      {/* PRECIO Section */}
      <div className="sidebar-section">
        <label className="sidebar-label">PRECIO</label>
        <div className="price-filters">
          <div className="price-input-group">
            <label className="price-label">MIN</label>
            <input
              type="number"
              className="form-control price-input"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              min="0"
            />
          </div>
          <div className="price-input-group">
            <label className="price-label">MAX</label>
            <input
              type="number"
              className="form-control price-input"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              min="0"
            />
          </div>
          <button className="btn btn-apply-filter" onClick={handleApplyPriceFilter}>
            Aplicar filtro
          </button>
        </div>
      </div>

      {/* FILTRAR Section */}
      <div className="sidebar-section">
        <label className="sidebar-label">FILTRAR</label>
        <div className="filter-checkboxes">
          <div className="filter-checkbox-item">
            <input
              type="checkbox"
              id="filter-nuevos"
              checked={localFilters.nuevos || false}
              onChange={() => handleFilterChange('nuevos')}
            />
            <label htmlFor="filter-nuevos">NUEVOS</label>
          </div>
          <div className="filter-checkbox-item">
            <input
              type="checkbox"
              id="filter-ofertas"
              checked={localFilters.ofertas || false}
              onChange={() => handleFilterChange('ofertas')}
            />
            <label htmlFor="filter-ofertas">OFERTAS</label>
          </div>
          <div className="filter-checkbox-item">
            <input
              type="checkbox"
              id="filter-edicion-especial"
              checked={localFilters.edicionEspecial || false}
              onChange={() => handleFilterChange('edicionEspecial')}
            />
            <label htmlFor="filter-edicion-especial">EDICIÓN ESPECIAL</label>
          </div>
          <div className="filter-checkbox-item">
            <input
              type="checkbox"
              id="filter-favoritos"
              checked={localFilters.favoritos || false}
              onChange={() => handleFilterChange('favoritos')}
            />
            <label htmlFor="filter-favoritos">FAVORITOS</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
