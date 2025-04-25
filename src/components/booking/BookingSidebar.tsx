// components/booking/BookingSidebar.tsx
import React from "react";
// Import icons needed for the sidebar content
import { Headset, HelpCircle, ShieldCheckIcon, Star, UserCog2, Utensils } from "lucide-react";

const BookingSidebar: React.FC = () => {
  return (
    <div className="bg-white shadow-sm rounded p-6 sticky top-6">
      {" "}
      {/* Sticky positioning from original HTML */}
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Why Book With Us?
      </h3>
      <div className="mb-4">
        {/* Benefit Items */}
        <div className="flex items-start mb-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#B4846C]/10 rounded-full mr-3 flex-shrink-0">
            <UserCog2 className="text-[#B4846C]" size={20} />{" "}
            {/* Use react-icons size */}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              Professional Chefs
            </h4>
            <p className="text-xs text-gray-600">
              Our team of experienced chefs will create a memorable culinary
              experience.
            </p>
          </div>
        </div>
        {/* Repeat for other benefits */}
        <div className="flex items-start mb-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#B4846C]/10 rounded-full mr-3 flex-shrink-0">
            <Utensils className="text-[#B4846C]" size={20} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              Customized Menus
            </h4>
            <p className="text-xs text-gray-600">
              We create personalized menus tailored to your event and
              preferences.
            </p>
          </div>
        </div>
        <div className="flex items-start mb-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#B4846C]/10 rounded-full mr-3 flex-shrink-0">
            <ShieldCheckIcon className="text-[#B4846C]" size={20} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              Quality Guaranteed
            </h4>
            <p className="text-xs text-gray-600">
              We use only the freshest ingredients and highest quality products.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="w-8 h-8 flex items-center justify-center bg-[#B4846C]/10 rounded-full mr-3 flex-shrink-0">
            <Headset className="text-[#B4846C]" size={20} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              Exceptional Service
            </h4>
            <p className="text-xs text-gray-600">
              Our attentive staff ensures your event runs smoothly from start to
              finish.
            </p>
          </div>
        </div>
      </div>
      {/* Customer Reviews */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Customer Reviews
        </h4>
        {/* Review 1 */}
        <div className="mb-3">
          <div className="flex items-center mb-1">
            <div className="flex text-yellow-400 mr-1">
              {/* Star icons */}
              <Star size={12} />
              <Star size={12} />
              <Star size={12} />
              <Star size={12} />
              <Star size={12} />
            </div>
            <span className="text-xs font-medium text-gray-900">
              Mrs. Shade
            </span>
          </div>
          <p className="text-xs text-gray-600">
            &quot;The catering service was exceptional...&quot;
          </p>
        </div>
        {/* Review 2 */}
        <div>
          <div className="flex items-center mb-1">
            <div className="flex text-yellow-400 mr-1">
              <Star size={12} />
              <Star size={12} />
              <Star size={12} />
              <Star size={12} />
              <Star size={12} />
            </div>
            <span className="text-xs font-medium text-gray-900">
              Racheal Micheal
            </span>
          </div>
          <p className="text-xs text-gray-600">
            &quot;They catered our wedding...&quot;
          </p>
        </div>
      </div>
      {/* Need Help section */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h4>
        <p className="text-xs text-gray-600 mb-3">
          If you have any questions...
        </p>
        <a
          href="https://walegrills.com/contact/"
          className="text-xs font-medium text-[#B4846C] flex items-center"
        >
          <HelpCircle className="mr-1" size={14} /> Contact Support
        </a>
      </div>
    </div>
  );
};

export default BookingSidebar;
