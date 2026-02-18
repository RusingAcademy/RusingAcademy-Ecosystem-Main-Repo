import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  { name: 'Government of Canada', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Government_of_Canada_logo.svg/2560px-Government_of_Canada_logo.svg.png' },
  { name: 'Health Canada', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Health_Canada_logo.svg/2560px-Health_Canada_logo.svg.png' },
  { name: 'CRA', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Canada_Revenue_Agency_logo.svg/2560px-Canada_Revenue_Agency_logo.svg.png' },
  { name: 'Global Affairs Canada', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Global_Affairs_Canada_logo.svg/2560px-Global_Affairs_Canada_logo.svg.png' },
];

export const TrustBar: React.FC = () => {
  return (
    <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
      <div className="container-ecosystem">
        <div className="flex flex-col items-center gap-8">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400">
            Trusted by Canada's Premier Institutions
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {logos.map((logo, index) => (
              <motion.img 
                key={index}
                src={logo.src} 
                alt={logo.name} 
                className="h-8 md:h-10 object-contain"
                whileHover={{ scale: 1.05, opacity: 0.8 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
