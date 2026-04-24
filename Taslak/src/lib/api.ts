import { db, storage } from "./firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const fetchFabrics = async () => {
  const querySnapshot = await getDocs(collection(db, "fabrics"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchCategories = async () => {
  const querySnapshot = await getDocs(collection(db, "categories"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const saveFabric = async (fabric: any) => {
  const { id, ...data } = fabric;
  if (id && !id.startsWith('new-')) {
    await setDoc(doc(db, "fabrics", id), data);
    return { id, ...data };
  } else {
    const docRef = await addDoc(collection(db, "fabrics"), data);
    return { ...data, id: docRef.id };
  }
};

export const deleteFabric = async (id: string) => {
  await deleteDoc(doc(db, "fabrics", id));
  return { success: true };
};

export const saveProduct = async (product: any) => {
  const { id, ...data } = product;
  if (id && !id.startsWith('new-')) {
    await setDoc(doc(db, "products", id), data);
    return { id, ...data };
  } else {
    const docRef = await addDoc(collection(db, "products"), data);
    return { ...data, id: docRef.id };
  }
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, "products", id));
  return { success: true };
};

export const uploadFile = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const storageRef = ref(storage, `uploads/${fileName}`);
  
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};
