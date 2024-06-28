import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import RelatedProduct from '../../component/user/home/related_product';
import { apiGetByID, apiProCat } from '../../services/user/product.services';


const Search = () => {
    const params = useParams();
    const [data, setData] = useState<any[]>([]);
    //   const [loading, setLoading] = useState(false);

    //   const navigate = useNavigate();

    const location = useLocation();
    const urlSearch = new URLSearchParams(location.search);
    const searchProId = urlSearch.getAll("product");

    const [fillterCategoryList, setFillterCategoryList] = useState<string[]>([]);

    useEffect(() => {
        const fetchDataProduct = async () => {
            let results = await apiGetByID(searchProId.join(''));
            setData(results.data?.[1])
        }
        fetchDataProduct()
    }, [params])

    return (
        <div className='container mx-auto'>
            <div>
                {data.length !== 0 && (
                    <RelatedProduct relatedProduct={data} />
                )}
            </div>
        </div>
    );
};

export default Search;
