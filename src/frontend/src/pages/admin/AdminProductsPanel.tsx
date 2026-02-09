import { useState } from 'react';
import { useGetAllProducts, useAddProduct } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';
import { ExternalBlob } from '../../backend';

export default function AdminProductsPanel() {
  const { data: products, isLoading } = useGetAllProducts();
  const addProduct = useAddProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [diameterRange, setDiameterRange] = useState('');
  const [standards, setStandards] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async () => {
    if (!name.trim() || !diameterRange.trim()) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      let photo: ExternalBlob | undefined;
      if (photoFile) {
        const bytes = new Uint8Array(await photoFile.arrayBuffer());
        photo = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      await addProduct.mutateAsync({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        diameterRange: diameterRange.trim(),
        standards: standards.trim(),
        specifications: specifications.trim(),
        price: price ? parseFloat(price) : undefined,
        available,
        photo,
      });

      toast.success('Product added successfully');
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const resetForm = () => {
    setName('');
    setDiameterRange('');
    setStandards('');
    setSpecifications('');
    setPrice('');
    setAvailable(true);
    setPhotoFile(null);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your HDPE pipe products</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the product details below
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., HDPE Pipe 50mm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diameterRange">Diameter Range *</Label>
                    <Input
                      id="diameterRange"
                      placeholder="e.g., 50mm"
                      value={diameterRange}
                      onChange={(e) => setDiameterRange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="standards">Standards / Certifications</Label>
                    <Input
                      id="standards"
                      placeholder="e.g., ISO 4427"
                      value={standards}
                      onChange={(e) => setStandards(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specifications">Specifications</Label>
                    <Textarea
                      id="specifications"
                      placeholder="Product specifications..."
                      value={specifications}
                      onChange={(e) => setSpecifications(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹ per meter)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photo">Product Photo</Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <p className="text-sm text-muted-foreground">
                        Uploading: {uploadProgress}%
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={available}
                      onCheckedChange={setAvailable}
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={addProduct.isPending}
                    className="w-full"
                  >
                    {addProduct.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Product'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products && products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Diameter</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.diameterRange}</TableCell>
                    <TableCell>
                      {product.price ? `₹${product.price.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.available ? 'default' : 'secondary'}>
                        {product.available ? 'Available' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No products yet. Add your first product to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
