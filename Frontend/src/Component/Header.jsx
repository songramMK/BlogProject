import React from 'react'
import banner from "../../src/assets/banner.png";
import ShuffleHero from './ShuffleHero';
import { Newsletter } from './Newsletter';
import { Outlet } from 'react-router';
import { BlogCard } from './BlogCard';
import { BlogList } from './BlogList';

export const Header = () => {
  return (
    <div className='bg-black'>
        <ShuffleHero></ShuffleHero>
        <BlogList></BlogList>
        <Newsletter></Newsletter>
    </div>
  )
}
