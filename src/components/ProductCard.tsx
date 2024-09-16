import React, { useState } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonImg } from '@ionic/react';
import { useDispatch } from 'react-redux';
import { addProduct } from '../redux/state/whishlistSlice';
import '../styles/ProductCard.css';

interface ProductCardProps {
  product: {
    id: number;
    title: string;
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
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [imgError, setImgError] = useState(false);

  const handleAddToWishlist = () => {
    const productToAdd = {
      id: product.id,
      name: product.title,
      price: product.price,
      description: product.description,
      images: product.images,
      category: product.category,
      userId: 0 
    };
    dispatch(addProduct(productToAdd));
  };

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <IonCard className="product-card">
      <IonImg
        className="product-img"
        src={imgError ? '/path/to/placeholder-image.jpg' : product.images[0]}
        alt={product.title}
        onError={handleImageError}
      />
      {imgError && (
        <div className="image-error-message">
          <p>Image not available</p>
        </div>
      )}
      <IonCardHeader>
        <IonCardTitle className="product-title">{product.title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="product-content">
        <p className="product-price">Price: ${product.price}</p>
        <p className="product-category">Category: {product.category.name}</p>
        <IonButton onClick={handleAddToWishlist} className="wishlist-button">
          Add to Wishlist
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default ProductCard;
