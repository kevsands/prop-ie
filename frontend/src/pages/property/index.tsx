import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import PropertyCard from '../components/property/PropertyCard';

const PropertiesPage: React.FC = () => {
  // Mock property data - will be replaced with API call later
  const [properties, setProperties] = useState([
    {
      id: 'prop-001',
      name: 'Fitzgerald Gardens - Unit 14',
      location: 'Dublin, Ireland',
      price: 385000,
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      imageUrl: '/placeholder-property.jpg',
      status: 'available'
    },
    {
      id: 'prop-002',
      name: 'Fitzgerald Gardens - Unit 15',
      location: 'Dublin, Ireland',
      price: 395000,
      bedrooms: 3,
      bathrooms: 2.5,
      area: 125,
      imageUrl: '/placeholder-property.jpg',
      status: 'available'
    },
    {
      id: 'prop-003',
      name: 'Fitzgerald Gardens - Unit 16',
      location: 'Dublin, Ireland',
      price: 375000,
      bedrooms: 3,
      bathrooms: 2,
      area: 118,
      imageUrl: '/placeholder-property.jpg',
      status: 'reserved'
    },
    {
      id: 'prop-004',
      name: 'Ballymakennyview - Unit 8',
      location: 'Drogheda, Ireland',
      price: 325000,
      bedrooms: 2,
      bathrooms: 2,
      area: 95,
      imageUrl: '/placeholder-property.jpg',
      status: 'available'
    },
    {
      id: 'prop-005',
      name: 'Ballymakennyview - Unit 9',
      location: 'Drogheda, Ireland',
      price: 330000,
      bedrooms: 2,
      bathrooms: 2,
      area: 98,
      imageUrl: '/placeholder-property.jpg',
      status: 'sold'
    },
    {
      id: 'prop-006',
      name: 'Ballymakennyview - Unit 10',
      location: 'Drogheda, Ireland',
      price: 340000,
      bedrooms: 3,
      bathrooms: 2,
      area: 110,
      imageUrl: '/placeholder-property.jpg',
      status: 'available'
    }
  ]);

  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    status: ''
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const filteredProperties = properties.filter(property => {
    if (filters.location && !property.location.includes(filters.location)) return false;
    if (filters.minPrice && property.price < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) return false;
    if (filters.bedrooms && property.bedrooms < parseInt(filters.bedrooms)) return false;
    if (filters.status && property.status !== filters.status) return false;
    return true;
  });

  return (
    <Layout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Properties</h1>
          
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Properties</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Locations</option>
                  <option value="Dublin">Dublin</option>
                  <option value="Drogheda">Drogheda</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price (€)
                </label>
                <input
                  type="number"
                  name="minPrice"
                  id="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min Price"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price (€)
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  id="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max Price"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <select
                  id="bedrooms"
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All</option>
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Property Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                name={property.name}
                location={property.location}
                price={property.price}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                imageUrl={property.imageUrl}
                status={property.status as 'available' | 'reserved' | 'sold'}
              />
            ))}
          </div>
          
          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No properties match your search criteria. Please try different filters.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PropertiesPage;
