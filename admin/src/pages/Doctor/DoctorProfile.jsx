import { React, useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl, setDToken } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)

  // Handle authentication errors
  const handleAuthError = (error) => {
    if (error.response?.status === 401 || 
        error.response?.data?.message?.toLowerCase().includes('not authorized') ||
        error.response?.data?.message?.toLowerCase().includes('invalid token') ||
        error.response?.data?.message?.toLowerCase().includes('token expired')) {
      
      console.log('Authentication failed in profile, clearing token')
      setDToken('')
      localStorage.removeItem('dToken')
      toast.error('Session expired. Please login again.')
      
      // Force page reload to redirect to login
      setTimeout(() => {
        window.location.reload()
      }, 1500)
      
      return true
    }
    return false
  }

  const updateProfile = async () => {
    try {
      if (!dToken) {
        toast.error('Authentication required')
        return
      }

      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available
      }

      const { data } = await axios.post(
        backendUrl + '/api/doctor/update-profile', 
        updateData, 
        { headers: { dToken } }
      )

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log('Update profile error:', error)
      
      // Handle authentication errors
      if (!handleAuthError(error)) {
        toast.error(error.response?.data?.message || error.message)
      }
    }
  }

  useEffect(() => {
    if (dToken) {
      console.log('Token exists, fetching profile data')
      getProfileData()
    } else {
      console.log('No token available in DoctorProfile')
    }
  }, [dToken])

  // Show loading state if no profile data
  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='flex flex-col gap-4 m-5'>
        <div>
          <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
        </div>
        <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
          {/* ---Doc Info: name, degree, experience--- */}
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{profileData.degree} - {profileData.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
          </div>
          
          {/* ---Doctor About--- */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{profileData.about}</p>
          </div>
          
          {/* ---Appointment Fee--- */}
          <p className='text-gray-600 font-medium mt-4'>
            Appointment fee: <span className='text-gray-800'>
              {currency} {isEdit ? (
                <input 
                  type="number" 
                  onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} 
                  value={profileData.fees}
                  className="border border-gray-300 rounded px-2 py-1 w-20 ml-2"
                  min="0"
                />
              ) : profileData.fees}
            </span>
          </p>
          
          {/* ---Address--- */}
          <div className='flex gap-2 py-2'>
            <p className="font-medium text-gray-600">Address:</p>
            <p className='text-sm'>
              {isEdit ? (
                <div className="space-y-2">
                  <input 
                    type="text" 
                    onChange={(e) => setProfileData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, line1: e.target.value } 
                    }))} 
                    value={profileData.address?.line1 || ''} 
                    placeholder="Address Line 1"
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                  <input 
                    type="text" 
                    onChange={(e) => setProfileData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, line2: e.target.value } 
                    }))} 
                    value={profileData.address?.line2 || ''} 
                    placeholder="Address Line 2"
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </div>
              ) : (
                <>
                  {profileData.address?.line1}
                  <br />
                  {profileData.address?.line2}
                </>
              )}
            </p>
          </div>
          
          {/* ---Availability--- */}
          <div className='flex gap-1 pt-2'>
            <input 
              onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} 
              checked={profileData.available} 
              type="checkbox" 
              disabled={!isEdit}
              className="mt-1"
            />
            <label className="text-gray-600 font-medium">Available</label>
          </div>
          
          {/* ---Action Buttons--- */}
          <div className="mt-5">
            {isEdit ? (
              <div className="flex gap-3">
                <button 
                  onClick={updateProfile} 
                  className='px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all'
                >
                  Save
                </button>
                <button 
                  onClick={() => {
                    setIsEdit(false)
                    // Reset any unsaved changes
                    getProfileData()
                  }} 
                  className='px-4 py-1 border border-gray-400 text-sm rounded-full hover:bg-gray-400 hover:text-white transition-all'
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEdit(true)} 
                className='px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all'
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
