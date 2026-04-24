export const fetchFabrics = async () => {
  const res = await fetch('/api/fabrics');
  if (!res.ok) throw new Error('Kumaşlar yüklenemedi');
  return res.json();
};

export const fetchProducts = async () => {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Ürünler yüklenemedi');
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Kategoriler yüklenemedi');
  return res.json();
};

export const saveFabric = async (fabric: any) => {
  const isNew = !fabric.id;
  const res = await fetch(`/api/fabrics${isNew ? '' : `/${fabric.id}`}`, {
    method: isNew ? 'POST' : 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fabric),
  });
  if (!res.ok) throw new Error('Kumaş kaydedilemedi');
  return res.json();
};

export const deleteFabric = async (id: string) => {
  const res = await fetch(`/api/fabrics/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Kumaş silinemedi');
  return res.json();
};

export const saveProduct = async (product: any) => {
  const isNew = !product.id;
  const res = await fetch(`/api/products${isNew ? '' : `/${product.id}`}`, {
    method: isNew ? 'POST' : 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Ürün kaydedilemedi');
  return res.json();
};

export const deleteProduct = async (id: string) => {
  const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Ürün silinemedi');
  return res.json();
};

export const uploadFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            data: reader.result
          })
        });
        if (!res.ok) throw new Error('Dosya yüklenemedi');
        const json = await res.json();
        resolve(json.url);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = error => reject(error);
  });
};
