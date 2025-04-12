import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">CampusMarket</h3>
            <p className="text-gray-500 text-sm">
              The trusted marketplace for college students to buy and sell items within their campus community.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/?tab=browse" className="text-gray-500 hover:text-primary">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link href="/create-listing" className="text-gray-500 hover:text-primary">
                  Post an Item
                </Link>
              </li>
              <li>
                <Link href="/messages" className="text-gray-500 hover:text-primary">
                  Messages
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/?category=1" className="text-gray-500 hover:text-primary">
                  Textbooks
                </Link>
              </li>
              <li>
                <Link href="/?category=2" className="text-gray-500 hover:text-primary">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/?category=3" className="text-gray-500 hover:text-primary">
                  Furniture
                </Link>
              </li>
              <li>
                <Link href="/?category=4" className="text-gray-500 hover:text-primary">
                  Clothing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  Safety Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CampusMarket. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-primary">
              <i className="ri-instagram-line text-lg"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-primary">
              <i className="ri-twitter-x-line text-lg"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-primary">
              <i className="ri-facebook-circle-line text-lg"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
