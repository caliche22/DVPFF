import enviroment from '../enviroment/enviroment';
const API_URL = `${enviroment.apiUrlC}/Product`;
const apiUrl = `${enviroment.platzi}products`;
const API_URL2 = `${enviroment.apiUrlC}/ListWhish`;

export const getProducts = async () => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductsPlat = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const addToWishlist = async (product: {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: {
    id: number;
    name: string;
    image: string;
    creationAt: string;
    updatedAt: string;
  };
  userId: number;
}) => {
  try {
    const response = await fetch(API_URL2, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 0,
        product: {
          externalId: product.id,
          title: product.name,
          price: product.price,
          description: product.description,
          images: product.images,
          creationAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          category: {
            externalId: product.category.id,
            name: product.category.name,
            image: product.category.image,
            creationAt: product.category.creationAt,
            updatedAt: product.category.updatedAt,
          },
        },
        userId: product.userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    throw error;
  }
};

export const addMultipleProductsToWishlist = async (
  products: {
    id: number;
    name: string;
    price: number;
    description: string;
    images: string[];
    category: {
      name: string;
      image: string;
    };
  }[],
  userId: number
) => {
  try {
    for (const product of products) {
      await addToWishlist({ ...product, userId });
    }
  } catch (error) {
    console.error('Error adding multiple products to wishlist:', error);
  }
};

export const getWishlist = async (userId: number) => {
  try {
    const response = await fetch(`${API_URL2}/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    const adaptedData = data.map((item: { product: any }) => ({
      id: item.product.id,
      name: item.product.title,
      price: item.product.price,
      description: item.product.description,
      images: item.product.images,
      category: {
        name: item.product.category.name,
        image: item.product.category.image,
      },
    }));

    return adaptedData;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

export const deleteProductFromWishlist = async (productId: number) => {
  try {
    const response = await fetch(`${API_URL2}/${productId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting product from wishlist:', error);
    throw error;
  }
};
