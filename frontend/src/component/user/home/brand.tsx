import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { apiGetAll } from "../../../services/user/brand.services";


const Brand: React.FC = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState<boolean>(false)
    const Loading = new Array(13).fill(null)

    const fetchData = async () => {
        setLoading(true)
        let results = await apiGetAll({});
        setData(results.data);
        setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center gap-4 justify-between overflow-scroll scrollbar-none">
                {
                    loading ? (
                        Loading.map((_, index) => (
                            <div key={"brandLoading" + index} className="h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden bg-slate-200">
                            </div>
                        ))
                    ) : (
                        data.map((item: any, index: any) => (
                            <div className="cursor-pointer flex flex-col items-center">
                                <div className="w-16 h-16 md:w-40 md:h-30 rounded-full overflow-hidden p-0 bg-slate-200 flex items-center justify-center">
                                    <img src={'images/brand/' + item.image} alt={item.image} className="h-full object-scale-down rounded mix-blend-multiply hover:scale-125 transition-all" />
                                </div>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    )
}

export default Brand
