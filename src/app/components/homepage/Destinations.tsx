import React from 'react';

interface Destination {
  name: string;
  imageUrl: string;
}

const destinations: Destination[] = [
  { name: 'Goa', imageUrl: '/assets/goa.jpg' },
  { name: 'Dubai', imageUrl: '/assets/dubai.jpg' },
  { name: 'Tailand', imageUrl: '/assets/tailand1.jpg' },
  { name: 'Jaipur', imageUrl: '/assets/jaipur.jpg' },
  { name: 'Delhi', imageUrl: '/assets/delhi.jpg' },
  { name: 'Paris', imageUrl: '/assets/paris.jpg' },
  { name: 'Maldieves', imageUrl: '/assets/maldevies.jpg' },
  { name: 'Malasya', imageUrl: '/assets/malasya.jpg' },
];

const Destinations: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Top Destinations 
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {destinations.map((dest, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            >
              {/* Image zoom */}
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="w-full h-48 object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
              />

              {/* Overlay for text visibility (transparent background) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h3 className="text-white text-xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {dest.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
