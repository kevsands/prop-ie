import React from 'react';
import { useRouter } from 'next/router';

interface PropertyCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  status: 'available' | 'reserved' | 'sold';
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  name,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  imageUrl,
  status
}) => {
  const router = useRouter();
  
  const handleViewProperty = () => {
    router.push(`/property/${id}`);
  };
  
  const statusColors = {
    available: 'bg-green-100 text-green-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-red-100 text-red-800'
  };
  
  const statusText = {
    available: 'Available',
    reserved: 'Reserved',
    sold: 'Sold'
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={imageUrl || '/placeholder-property.jpg'} 
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {statusText[status]}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500 mb-2">{location}</p>
        <p className="text-xl font-bold text-gray-900 mb-2">€{price.toLocaleString()}</p>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>{bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}</span>
          </div>
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011-1h8a1 1 0 011 1v1h1a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h1V2a1 1 0 011-1zm11 1H4a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1h-1z" clipRule="evenodd" />
            </svg>
            <span>{bathrooms} {bathrooms === 1 ? 'bath' : 'baths'}</span>
          </div>
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span>{area} m²</span>
          </div>
        </div>
        <button
          onClick={handleViewProperty}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={status === 'sold'}
        >
          {status === 'available' ? 'View Details' : status === 'reserved' ? 'View Details' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
