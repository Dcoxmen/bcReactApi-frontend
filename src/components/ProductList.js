import React, {useState} from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

const PRODUCTS_QUERY = gql`
  query products($search: String, $brand_id: ID, $categories: [Int], $sku: String) {
    products(search: $search, brand_id: $brand_id, categories: $categories, sku: $sku) {
      id
      name
      price
      brand_id
      categories
      sku
      images {
        url
        thumbnail_url
      }
    }
  }
`;

function ProductsList({ search, brand_id, categories, sku }) {
  const [searchTerm, setSearchTerm] = useState(search);
  const [brandId, setBrandId] = useState(brand_id);
  const [categoryIds, setCategoryIds] = useState(categories);
  const [skuCode, setSkuCode] = useState(sku);

  const { loading, error, data } = useQuery(PRODUCTS_QUERY, {
    variables: { search: searchTerm, brand_id: brandId, categories: categoryIds, sku: skuCode },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // call the query here with new variables.
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>

<form onSubmit={handleSubmit}>
        <label>
          Search:
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <label>
          Brand ID:
          <input
            type="text"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
          />
        </label>
        <label>
          Categories:
          <input
            type="text"
            value={categoryIds}
            onChange={(e) => setCategoryIds(e.target.value.split(',').map((c) => parseInt(c)))}
          />
        </label>
        <label>
          SKU:
          <input
            type="text"
            value={skuCode}
            onChange={(e) => setSkuCode(e.target.value)}
          />
        </label>
        <button type="submit">Search</button>
      </form>
      {data.products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>Price: ${product.price}</p>
          <p>Brand ID: {product.brand_id}</p>
          <p>Category IDs: {product.categories ? product.categories.join(', ') : "N/A"}</p>
          <p>SKU: {product.sku}</p>
          {product.images.map((image) => (
            <img src={image.thumbnail_url} key={image.url} alt={product.name} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default ProductsList;
