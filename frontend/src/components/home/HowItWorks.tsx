import React from 'react';
import { UserSearch, Upload, MessageSquare, ShoppingBag } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <UserSearch className="h-12 w-12 text-orange-500" />,
      title: 'Create an Account',
      description: 'Sign up using your IIT Patna email to access the campus marketplace.',
    },
    {
      icon: <Upload className="h-12 w-12 text-orange-500" />,
      title: 'List Items for Sale',
      description: 'Upload photos and details of the items you want to sell.',
    },
    {
      icon: <MessageSquare className="h-12 w-12 text-orange-500" />,
      title: 'Chat with Buyers/Sellers',
      description: 'Use the built-in messaging system to negotiate and arrange meetups.',
    },
    {
      icon: <ShoppingBag className="h-12 w-12 text-orange-500" />,
      title: 'Complete the Transaction',
      description: 'Meet on campus, exchange the item, and complete the sale.',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How SWAPSHOP Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform makes buying and selling second-hand items within IIT Patna safe, easy, and convenient.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center h-full z-10 relative">
                <div className="mb-4 p-3 rounded-full bg-orange-100 inline-flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-orange-300 z-0"></div>
              )}
              
              {/* Step number badge */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-sm z-20">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;