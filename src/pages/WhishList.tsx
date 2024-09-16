import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonToolbar, IonTitle, IonList, IonItem, IonButton, IonText, IonSelect, IonSelectOption } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { removeProduct, addProduct } from '../redux/state/whishlistSlice';
import { addMultipleProductsToWishlist, deleteProductFromWishlist, getWishlist } from '../services/services';
import { useHistory } from 'react-router-dom';
import '../styles/Whislist.css';

const Wishlist: React.FC = () => {
  const [userId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('name');
  const reduxWishlist = useSelector((state: RootState) => state.wishlist.items);
  const dispatch = useDispatch();
  const history = useHistory();
  const [backendWishlist, setBackendWishlist] = useState<any[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const data = await getWishlist(userId);
        setBackendWishlist(data);
        setError(null);
      } catch (error) {
        setError('Error loading your wishlist. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  const goBack = () => {
    history.goBack();
  };

  const sortWishlist = (wishlist: any[], sortBy: string) => {
    return [...wishlist].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });
  };

  const sortedReduxWishlist = sortWishlist(reduxWishlist, sortBy);
  const sortedBackendWishlist = sortWishlist(backendWishlist, sortBy);

  const handleSaveProduct = async (product: any) => {
    dispatch(addProduct(product));
    try {
      await addMultipleProductsToWishlist([product], userId)
      dispatch(removeProduct(product.id));
      const updatedWishlist = await getWishlist(userId);
      setBackendWishlist(updatedWishlist);
    } catch (error) {
      setError('Error adding product to wishlist. Please try again.');
    }
  };

  const handleRemoveProductFromRedux = (productId: number) => {
    dispatch(removeProduct(productId));
  };

  const handleRemoveProductFromServer = async (productId: number) => {
    try {
      const exists = backendWishlist.some(product => product.id === productId);
      if (!exists) {
        setError('Product not found in the wishlist');
        return;
      }

      const result = await deleteProductFromWishlist(productId);
      if (result.success) {
        const updatedWishlist = await getWishlist(userId);
        setBackendWishlist(updatedWishlist);
        dispatch(removeProduct(productId));
      } else {
        setError('Error removing product from the server. Please try again.');
      }
    } catch (error) {
      setError('Error removing product from the server. Please try again.');
    }
  };

  if (loading) return <IonContent>Loading...</IonContent>;

  return (
    <IonPage>
      <IonToolbar>
        <IonTitle>Wishlist</IonTitle>
        <IonButton slot="start" onClick={goBack}>Back</IonButton>
        <IonSelect
          value={sortBy}
          placeholder="Sort By"
          onIonChange={e => setSortBy(e.detail.value)}
          slot="end"
          className="wishlist-sort-select"
        >
          <IonSelectOption value="name">Name</IonSelectOption>
          <IonSelectOption value="price">Price</IonSelectOption>
        </IonSelect>
      </IonToolbar>
      <IonContent className="wishlist-content">
        {error && <IonText color="danger"><p>{error}</p></IonText>}
        <IonList className="wishlist-list">
          <IonItem className="wishlist-item-header">
            <IonText color="primary">Server Wishlist</IonText>
          </IonItem>
          {sortedBackendWishlist.length === 0 ? (
            <IonText>No products in your server wishlist.</IonText>
          ) : (
            sortedBackendWishlist.map(product => (
              <IonItem className="wishlist-item" key={product.id}>
                <div className="wishlist-product-info">
                  <IonText className="wishlist-title">{product.name}</IonText>
                  <IonText className="wishlist-price">${product.price}</IonText>
                </div>
                <IonButton
                  slot="end"
                  onClick={() => handleRemoveProductFromServer(product.id)}
                >
                  Remove
                </IonButton>
              </IonItem>
            ))
          )}
        </IonList>
        <IonList className="wishlist-list">
          <IonItem className="wishlist-item-header">
            <IonText color="primary">Redux Wishlist</IonText>
          </IonItem>
          {sortedReduxWishlist.length === 0 ? (
            <IonText>No products in your Redux wishlist.</IonText>
          ) : (
            sortedReduxWishlist.map(product => (
              <IonItem className="wishlist-item" key={product.id}>
                <div className="wishlist-product-info">
                  <IonText className="wishlist-title">{product.name}</IonText>
                  <IonText className="wishlist-price">${product.price}</IonText>
                </div>
                <IonButton
                  slot="end"
                  onClick={() => handleSaveProduct(product)}
                >
                  Save
                </IonButton>
                <IonButton
                  slot="end"
                  onClick={() => handleRemoveProductFromRedux(product.id)}
                >
                  Remove
                </IonButton>
              </IonItem>
            ))
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Wishlist;
