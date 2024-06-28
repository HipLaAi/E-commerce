import React from 'react'
import Slide from '../../component/user/home/slide'
import Brand from '../../component/user/home/brand'
import Category from '../../component/user/home/category'
import HorizontalProduct from '../../component/user/home/horizontal_product'
import VerticalProduct from '../../component/user/home/vertical_product'
import Product from '../../component/user/product'

const Home = () => {
  return (
    <div>
      <Brand />
      <Slide />
      <HorizontalProduct />
      <Category />
      {/* <VerticalProduct /> */}
      <Product />
    </div>
  )
}

export default Home