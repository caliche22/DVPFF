import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getProductsPlat } from '../services/services';
import { IonFooter, IonHeader, IonTitle, IonToolbar, IonContent, IonButton, IonCol, IonGrid, IonPage, IonRow } from '@ionic/react';
import '../styles/Home.css'
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const mockProducts = [
    { id: 1, name: 'Sample Product 1', price: 10 },
    { id: 2, name: 'Sample Product 2', price: 20 },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProductsPlat();
        setProducts(productsData);
      } catch (error) {
        setError('Failed to fetch products.');
      }
    };
    fetchProducts();
  }, []);

  const goToWishList = () => {
    history.push('/wishlist'); 
  };


  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Products</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className='home-content'>
      {error && <p>{error}</p>}
      <IonGrid>
        <IonRow>
          {products.map(product => (
            <IonCol size="12" sizeSm="6" sizeMd="4" key={product.id}>
              <ProductCard product={product} />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
      <IonButton onClick={goToWishList}>Go to Wishlist</IonButton>
    </IonContent>
    <IonFooter>
      <IonToolbar>
        <IonTitle>Prueba Front Carlos Arboleda</IonTitle>
      </IonToolbar>
    </IonFooter>
  </IonPage>
);
};

export default Home;