import { useQuery } from "@tanstack/react-query";
import CategoryCard from "../products/category-card";
import { Category } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesSection() {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">Error loading categories. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="flex flex-col items-center p-4">
            <Skeleton className="h-12 w-12 rounded-full mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories?.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
