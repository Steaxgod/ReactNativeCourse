import axios from "axios";
import React, { useEffect, useState } from "react";

const baseURL = "http://localhost:3000/";

type ProductDetail = {
  // Здесь определите поля для типа ProductDetail
  id: number;
  title: string;
  // и другие поля
};

const useFetch = (url: string) => {
  const [data, setData] = useState<ProductDetail | undefined>(undefined);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get<ProductDetail>(`${baseURL}${url}`);
        setData(response.data);
      } catch (error) {
        console.log("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [url]);

  return { data, loading };
};
