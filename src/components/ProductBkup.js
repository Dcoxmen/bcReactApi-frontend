import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const PRODUCTS_QUERY = gql`
  query Products {
    products {
      id
      name
      price
      brand_id
      custom_fields {
        name
        value
      }
      sku
      images {
        url
        thumbnail_url
      }
    }
  }
`;

function ProductList() {
  const { loading, error, data } = useQuery(PRODUCTS_QUERY);
  const [brandFilter, setBrandFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  const handleBrandFilterChange = (e) => {
    setBrandFilter(e.target.value);
  };

  const handleNameFilterChange = (e) => {
    setNameFilter(e.target.value);
  };

  const handleCustomFieldFilterChange = (name) => (e) => {
    setCustomFieldFilters({...customFieldFilters, [name]: e.target.value});
  }
  const uniqueCustomFields = data ? Array.from(new Set(data.products.flatMap(p => p.custom_fields.map(cf => cf.name)))) : []

  const [customFieldFilters, setCustomFieldFilters] = useState(
    uniqueCustomFields.reduce((acc,name) => ({...acc, [name]:''}), {})
);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;


  const filteredProducts = data && data.products ? data.products.filter(product => {
    if (brandFilter && !product.brand_id.toLowerCase().includes(brandFilter.toLowerCase())) return false;
    if (nameFilter && !product.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
  
    for (let i = 0; i < product.custom_fields.length; i++) {
      const customField = product.custom_fields[i];
      const filterValue = customFieldFilters[customField.name] ? customFieldFilters[customField.name].toString() : "";
      if (filterValue && !customField.value.toLowerCase().includes(filterValue.toLowerCase())) return false;
    }
  
    return true;
  }) : [];
  


    if(!filteredProducts.length) return <p>No products found.</p>

    return (
      <>
        <input
          type="text"
          placeholder="Filter by brand_id"
          value={brandFilter}
          onChange={handleBrandFilterChange}
        />
        <input
          type="text"
          placeholder="Filter by name"
          value={nameFilter}
          onChange={handleNameFilterChange}
        />
        {uniqueCustomFields.map(name => (
            <input
                key={name}
                type="text"
                placeholder={`Filter by ${name}`}
                value={customFieldFilters[name] || ""}
                onChange={handleCustomFieldFilterChange(name)}
            />
        ))}
        <ul>
          {filteredProducts.map(product => (
            <li key={product.id}>
              <h2>{product.name}</h2>
              <p>Price: {product.price}</p>
              <p>Brand: {product.brand_id}</p>
              <p>SKU: {product.sku}</p>
              {product.images[0] && <img src={product.images[0].thumbnail_url} alt={product.name} />}
              <ul>
                {product.custom_fields.map(custom_field => (
                  <li  key={`${custom_field.name}_${custom_field.index}`}>
                    <p>{custom_field.name} : {custom_field.value}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </>
    );
  
}

export default ProductList;


