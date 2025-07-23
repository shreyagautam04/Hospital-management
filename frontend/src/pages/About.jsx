import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>
          ABOUT <span className='text-gray-700 font-medium'>US</span>
        </p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
        
          <p>Welcome to Healthcare , Healthcare management involves organizing, directing, and supervising healthcare systems, hospitals, or clinics to improve patient care, streamline operations, manage staff, and ensure compliance with regulations and quality standards. </p>
          <p>Healthcare management is the strategic planning, organization, and coordination of healthcare services to ensure quality patient care, efficient operations, regulatory compliance, and effective use of resources in medical settings.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>To revolutionize healthcare by delivering seamless, patient-centered management solutions that enhance care quality, optimize operations, and empower providers through innovation, compassion, and excellence.</p>
          </div>
      </div>
      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'> CHOOSE US</span></p>
      </div>
      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-16 flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficiency:</b>
            <p>Efficiency in healthcare means delivering the best possible care using the least amount of time, effort, and resources—without compromising quality. It focuses on reducing delays, avoiding waste, and optimizing workflows to improve patient outcomes and staff productivity.</p>
        </div>
        <div className='border px-10 md:px-16 py-16 flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>  
        <b>Convenience:</b>
        <p>Convenience means making healthcare accessible, quick, and easy—allowing patients to book appointments, access records, and receive care anytime, anywhere, without unnecessary hassle.</p>
        </div>
        <div className='border px-10 md:px-16 py-16 flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>Personalization:</b>
        <p>Personalization ensures that care is tailored to each patient’s unique needs, preferences, and medical history—leading to better outcomes and a more human-centered experience.</p></div>
      </div>
    </div>
  )
}

export default About
