import { Category } from "@shared/schema";
import { Link } from "wouter";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/?category=${category.id}`}>
      <div className="flex flex-col items-center p-4 bg-[#F8F9FA] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <i className={`ri-${category.icon}-line text-xl text-primary`}></i>
        </div>
        <span className="text-sm font-medium text-center">{category.name}</span>
      </div>
    </Link>
  );
}
