import { useEffect } from 'react';
import { useGetAllProducts, useGetSiteSettings } from '../hooks/useQueries';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function ProductsPage() {
  const { data: products, isLoading } = useGetAllProducts();
  const { data: settings } = useGetSiteSettings();

  useEffect(() => {
    document.title = 'Products - Onkar Raj Infra HDPE Pipes';
  }, []);

  return (
    <div className="py-12 md:py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Our Products</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            High-quality HDPE pipes available in diameters ranging from 20mm to 180mm, suitable for various industrial, agricultural, and infrastructure applications.
          </p>
          {settings?.certifications && (
            <div className="mt-6">
              <Badge variant="secondary" className="text-sm">
                {settings.certifications}
              </Badge>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-48 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="mb-2 h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const imageUrl = product.photo
                ? product.photo.getDirectURL()
                : '/assets/generated/hdpe-pipe-placeholder.dim_800x600.png';

              return (
                <Card key={product.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="h-48 w-full object-cover"
                      loading="lazy"
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="mb-2">{product.name}</CardTitle>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium">Diameter:</span> {product.diameterRange}
                      </p>
                      {product.standards && (
                        <p>
                          <span className="font-medium">Standards:</span> {product.standards}
                        </p>
                      )}
                      {product.specifications && (
                        <p className="line-clamp-2">{product.specifications}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t p-6">
                    <div className="flex items-center gap-2">
                      {product.available ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">Available</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Out of Stock</span>
                        </>
                      )}
                    </div>
                    {product.price && (
                      <span className="text-lg font-bold">₹{product.price.toFixed(2)}</span>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
