import { useState } from 'react';
import { useGetAllProducts, useAddProduct } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Product } from '../../backend';
import { ExternalBlob } from '../../backend';

export default function AdminProductsPanel() {
  const { data: products, isLoading } = useGetAllProducts();
  const addProductMutation = useAddProduct();

  const [formData, setFormData] = useState({
    name: '',
    diameterRange: '',
    standards: '',
    specifications: '',
    price: '',
    available: true,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let photoBlob: ExternalBlob | undefined;
      if (photoFile) {
        const arrayBuffer = await photoFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        photoBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      const product: Product = {
        id: `product-${Date.now()}`,
        name: formData.name,
        diameterRange: formData.diameterRange,
        standards: formData.standards,
        specifications: formData.specifications,
        price: formData.price ? parseFloat(formData.price) : undefined,
        available: formData.available,
        photo: photoBlob,
      };

      await addProductMutation.mutateAsync(product);

      // Reset form
      setFormData({
        name: '',
        diameterRange: '',
        standards: '',
        specifications: '',
        price: '',
        available: true,
      });
      setPhotoFile(null);
      setUploadProgress(0);
    } catch (error: any) {
      console.error('Failed to add product:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Add a new HDPE pipe product to the catalog</CardDescription>
        </CardHeader>
        <CardContent>
          {addProductMutation.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {addProductMutation.error.message || 'Failed to add product'}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={addProductMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diameterRange">Diameter Range</Label>
                <Input
                  id="diameterRange"
                  placeholder="e.g., 20mm - 110mm"
                  value={formData.diameterRange}
                  onChange={(e) => setFormData({ ...formData, diameterRange: e.target.value })}
                  required
                  disabled={addProductMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="standards">Standards</Label>
                <Input
                  id="standards"
                  placeholder="e.g., IS 4984, ISO 4427"
                  value={formData.standards}
                  onChange={(e) => setFormData({ ...formData, standards: e.target.value })}
                  required
                  disabled={addProductMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹/meter)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  disabled={addProductMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specifications">Specifications</Label>
              <Textarea
                id="specifications"
                placeholder="Enter product specifications..."
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                required
                disabled={addProductMutation.isPending}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Product Photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                disabled={addProductMutation.isPending}
              />
              {uploadProgress > 0 && uploadProgress < 100 && (
                <p className="text-sm text-muted-foreground">Upload progress: {uploadProgress}%</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                disabled={addProductMutation.isPending}
              />
              <Label htmlFor="available">Available for order</Label>
            </div>

            <Button type="submit" disabled={addProductMutation.isPending} className="w-full">
              {addProductMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Products</CardTitle>
          <CardDescription>
            {products?.length || 0} product{products?.length !== 1 ? 's' : ''} in catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products && products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.diameterRange}</p>
                      <p className="text-sm text-muted-foreground">{product.standards}</p>
                      {product.price && (
                        <p className="mt-1 text-sm font-medium">₹{product.price}/meter</p>
                      )}
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        product.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No products added yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
